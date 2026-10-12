import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DAYS, DAY_LABELS, WeekHours } from "@/lib/bahamasTime";
import { ISLANDS, WHATSAPP_RE, WEBSITE_RE, INSTAGRAM_RE, FACEBOOK_RE } from "@/lib/businessLinks";

const opt = (re: RegExp, msg: string) =>
  z.string().trim().transform((v) => v || null).refine((v) => v === null || re.test(v), msg);

const schema = z.object({
  description: z.string().trim().max(600, "Max 600 characters").transform((v) => v || null),
  island: z.string().transform((v) => v || null).refine((v) => v === null || (ISLANDS as readonly string[]).includes(v)),
  whatsapp: opt(WHATSAPP_RE, "WhatsApp: digits only, e.g. +12425551234"),
  website: opt(WEBSITE_RE, "Website must start with https://"),
  instagram: opt(INSTAGRAM_RE, "Instagram: username only, no @ or link"),
  facebook: opt(FACEBOOK_RE, "Facebook: page name only, no link"),
});

const TIME_RE = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const defaultHours = (): WeekHours =>
  Object.fromEntries(DAYS.map((d) => [d, { closed: d === "sun", open: "09:00", close: "17:00" }])) as WeekHours;

const BusinessDetailsForm = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["my-business-details", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("business_details").select("*").eq("business_id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const [form, setForm] = useState({ description: "", island: "", whatsapp: "", website: "", instagram: "", facebook: "" });
  const [hours, setHours] = useState<WeekHours>(defaultHours);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm({
      description: data.description ?? "", island: data.island ?? "", whatsapp: data.whatsapp ?? "",
      website: data.website ?? "", instagram: data.instagram ?? "", facebook: data.facebook ?? "",
    });
    if (data.hours) setHours(data.hours as WeekHours);
  }, [data]);

  const setDay = (d: (typeof DAYS)[number], patch: Partial<{ closed: boolean; open: string; close: string }>) =>
    setHours((h) => ({ ...h, [d]: { closed: false, open: "09:00", close: "17:00", ...h[d], ...patch } }));

  const save = async () => {
    if (!user) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    for (const d of DAYS) {
      const h = hours[d];
      if (h && !h.closed && (!TIME_RE.test(h.open ?? "") || !TIME_RE.test(h.close ?? "") || h.open === h.close)) {
        return toast.error(`${DAY_LABELS[d]}: opening and closing times must differ`);
      }
    }
    const cleanHours = Object.fromEntries(DAYS.map((d) => {
      const h = hours[d] ?? { closed: true };
      return [d, h.closed ? { closed: true } : { closed: false, open: h.open, close: h.close }];
    }));
    setSaving(true);
    const { error } = await supabase.from("business_details")
      .upsert({ business_id: user.id, ...parsed.data, hours: cleanHours }, { onConflict: "business_id" });
    setSaving(false);
    if (error) return toast.error("Couldn't save. Check the fields and try again.");
    toast.success("Business details saved");
    qc.invalidateQueries({ queryKey: ["my-business-details"] });
    qc.invalidateQueries({ queryKey: ["approved-businesses"] });
    qc.invalidateQueries({ queryKey: ["business-profile", user.id] });
  };

  const field = (k: keyof typeof form, label: string, ph: string) => (
    <div className="space-y-1">
      <Label htmlFor={`bd-${k}`}>{label}</Label>
      <Input id={`bd-${k}`} value={form[k]} placeholder={ph} className="h-11"
        onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business details</CardTitle>
        <p className="text-sm text-muted-foreground">
          These edits don't need re-approval. Changing your business name or category (in Edit Profile) sends your business back for review.
          {user && <> <Link className="underline" to={`/business/${user.id}`}>View public page</Link></>}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
          <>
            <div className="space-y-1">
              <Label htmlFor="bd-description">Description</Label>
              <Textarea id="bd-description" maxLength={600} value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bd-island">Island</Label>
              <select id="bd-island" value={form.island} onChange={(e) => setForm((f) => ({ ...f, island: e.target.value }))}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Not set</option>
                {ISLANDS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {field("whatsapp", "WhatsApp number", "+12425551234")}
              {field("website", "Website", "https://example.com")}
              {field("instagram", "Instagram username", "yourbusiness")}
              {field("facebook", "Facebook page name", "yourbusiness")}
            </div>
            <fieldset className="space-y-2">
              <legend className="font-medium text-sm mb-1">Opening hours (Bahamas time)</legend>
              {DAYS.map((d) => {
                const h = hours[d] ?? { closed: true };
                return (
                  <div key={d} className="flex flex-wrap items-center gap-2">
                    <span className="w-24 text-sm">{DAY_LABELS[d]}</span>
                    <label className="flex items-center gap-2 text-sm min-h-[44px]">
                      <Switch checked={!h.closed} onCheckedChange={(v) => setDay(d, { closed: !v })} aria-label={`${DAY_LABELS[d]} open`} />
                      {h.closed ? "Closed" : "Open"}
                    </label>
                    {!h.closed && (
                      <>
                        <Input type="time" aria-label={`${DAY_LABELS[d]} opens`} className="h-11 w-28" value={h.open ?? ""} onChange={(e) => setDay(d, { open: e.target.value })} />
                        <span aria-hidden>–</span>
                        <Input type="time" aria-label={`${DAY_LABELS[d]} closes`} className="h-11 w-28" value={h.close ?? ""} onChange={(e) => setDay(d, { close: e.target.value })} />
                      </>
                    )}
                  </div>
                );
              })}
              <Button type="button" variant="ghost" size="sm" className="min-h-[44px]"
                onClick={() => setHours((hh) => ({ ...hh, ...Object.fromEntries(["tue", "wed", "thu", "fri"].map((d) => [d, { ...(hh.mon ?? { closed: true }) }])) }))}>
                Copy Monday to Tue–Fri
              </Button>
              <p className="text-xs text-muted-foreground">Closing earlier than opening means overnight (e.g. 22:00 – 02:00).</p>
            </fieldset>
            <Button onClick={save} disabled={saving} className="min-h-[44px] touch-manipulation active:scale-95">
              {saving ? "Saving…" : "Save business details"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessDetailsForm;
