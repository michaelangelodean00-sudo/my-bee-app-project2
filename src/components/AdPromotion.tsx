import { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe, 
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Eye,
  MousePointerClick,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const benefits = [
  {
    icon: Target,
    title: "Precision Targeting",
    description: "Reach your ideal customers with AI-powered audience segmentation based on interests, behavior, and demographics.",
    stat: "94%",
    statLabel: "targeting accuracy"
  },
  {
    icon: TrendingUp,
    title: "Higher ROI",
    description: "Our advertisers see an average 3.2x return on ad spend compared to traditional social platforms.",
    stat: "3.2x",
    statLabel: "average ROAS"
  },
  {
    icon: Users,
    title: "Engaged Community",
    description: "Access a highly engaged user base that actively interacts with content and ads alike.",
    stat: "78%",
    statLabel: "engagement rate"
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track impressions, clicks, conversions, and ROI with our comprehensive dashboard.",
    stat: "Live",
    statLabel: "performance data"
  }
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for small businesses",
    features: [
      "Up to 10,000 impressions",
      "Basic targeting options",
      "Standard ad formats",
      "Email support"
    ],
    popular: false
  },
  {
    name: "Growth",
    price: "$299",
    period: "/month",
    description: "Scale your reach effectively",
    features: [
      "Up to 50,000 impressions",
      "Advanced AI targeting",
      "Video & carousel ads",
      "Priority support",
      "A/B testing tools"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale campaigns",
    features: [
      "Unlimited impressions",
      "Custom audience segments",
      "Dedicated account manager",
      "API access",
      "White-label options"
    ],
    popular: false
  }
];

const stats = [
  { value: "2M+", label: "Active Users", icon: Users },
  { value: "500K+", label: "Daily Impressions", icon: Eye },
  { value: "12%", label: "Avg. CTR", icon: MousePointerClick },
  { value: "4.9★", label: "Advertiser Rating", icon: Award }
];

const AdPromotion = () => {
  const [selectedTier, setSelectedTier] = useState("Growth");

  return (
    <div className="w-full bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Limited Time: 30% Off First Campaign
          </Badge>
          
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent leading-tight">
            Grow Your Business with B.E.E Ads
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with millions of engaged users and turn views into customers. 
            The smartest way to advertise your business online.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/25">
              Start Advertising <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              View Success Stories
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="p-4 md:p-6 text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Why Businesses Choose B.E.E
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our platform combines cutting-edge technology with an engaged community to deliver unmatched advertising results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="group bg-card/80 backdrop-blur border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                      <div className="flex items-baseline gap-2 pt-2">
                        <span className="text-2xl font-bold text-primary">{benefit.stat}</span>
                        <span className="text-xs text-muted-foreground">{benefit.statLabel}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <Shield className="w-10 h-10 text-primary" />
              <h3 className="font-semibold text-foreground">Brand Safe Environment</h3>
              <p className="text-sm text-muted-foreground">
                Your ads appear alongside quality, moderated content
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Zap className="w-10 h-10 text-primary" />
              <h3 className="font-semibold text-foreground">Quick Setup</h3>
              <p className="text-sm text-muted-foreground">
                Launch your first campaign in under 5 minutes
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Globe className="w-10 h-10 text-primary" />
              <h3 className="font-semibold text-foreground">Global Reach</h3>
              <p className="text-sm text-muted-foreground">
                Connect with audiences in 50+ countries
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose a plan that fits your business needs. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  tier.popular 
                    ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                    : 'border-border/50 hover:border-primary/30'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>

                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      tier.popular 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                        : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                    }`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-amber-500 border-0 overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center text-white relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyek0zNCAzNGgtNHYtMmg0djJ6bS02IDBoLTR2LTJoNHYyem0xMCAwaC00di0yaDR2MnptLTEwLTZoLTR2LTJoNHYyem0xMCAwaC00di0yaDR2MnptLTEwLTZoLTR2LTJoNHYyem0xMCAwaC00di0yaDR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
            
            <div className="relative z-10 space-y-6">
              <DollarSign className="w-12 h-12 mx-auto opacity-90" />
              <h2 className="text-2xl md:text-4xl font-bold">
                Start Growing Your Business Today
              </h2>
              <p className="text-lg opacity-90 max-w-xl mx-auto">
                Join 10,000+ businesses already using B.E.E Ads to reach new customers and drive sales.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 gap-2 font-bold shadow-lg">
                  Create Your First Ad <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm opacity-75">
                No credit card required • Free trial available
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdPromotion;
