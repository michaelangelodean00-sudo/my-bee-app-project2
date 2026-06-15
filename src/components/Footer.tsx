import { memo } from "react";
import { Link } from "react-router-dom";
import { Building2, Calendar, ShoppingCart, Settings, UserCircle, Mail } from "lucide-react";

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Explore",
      links: [
        { label: "Business", to: "/businesses", icon: Building2 },
        { label: "Events", to: "/events", icon: Calendar },
        { label: "E-commerce", to: "/ecommerce", icon: ShoppingCart },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Profile", to: "/profile", icon: UserCircle },
        { label: "Settings", to: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-background to-muted/40 border-t border-border/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-heading text-lg font-bold text-foreground tracking-tight">
              B.E.E App Bahamas
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Business · Events · E-commerce. The local hub for Bahamian discovery.
            </p>
            <a
              href="mailto:hello@beeapp.bs"
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail size={14} />
              hello@beeapp.bs
            </a>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Icon size={14} />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {currentYear} B.E.E App Bahamas. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/70 text-center md:text-right">
            Trademark and copyright protected.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
