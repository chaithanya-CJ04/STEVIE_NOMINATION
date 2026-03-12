"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { completeUserProfile, getUserProfile } from "@/lib/api";
import type { CreateProfileRequest, UserProfile } from "@/lib/types";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineBanner } from "@/components/OfflineBanner";
import { motion } from "framer-motion";

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Costa Rica",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Estonia",
  "Ethiopia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Guatemala",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Mauritius",
  "Mexico",
  "Moldova",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Panama",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Tanzania",
  "Thailand",
  "Tunisia",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Venezuela",
  "Vietnam",
  "Zambia",
  "Zimbabwe",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // ── Step 1: get session (fast — local Supabase cache) ──────────
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session) {
          router.replace("/auth");
          return;
        }

        const token = session.access_token;
        const userEmail = session.user.email ?? "";
        if (mounted) setEmail(userEmail);

        // ── Step 2: reveal the form immediately, don't wait for API ─────
        // We race the profile fetch against a 1.5-second timeout so the
        // form never stays hidden longer than ~1.5 s regardless of server
        // speed.
        if (mounted) setChecking(false);

        const profileFetch = getUserProfile(token);
        const timeout = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 1500)
        );

        const result = await Promise.race([profileFetch, timeout]);

        if (!mounted) return;

        if (result === null) {
          // timeout won — profile fetch is still in-flight, silently ignore
          return;
        }

        const profile = result as UserProfile;

        // If they already completed onboarding, redirect away silently
        if (profile.has_completed_onboarding) {
          router.replace("/chat");
          return;
        }

        // Pre-fill any existing values
        if (profile.full_name) setFullName(profile.full_name);
        if (profile.country) setCountry(profile.country);
        if (profile.organization_name) setOrganizationName(profile.organization_name);
        if (profile.job_title) setJobTitle(profile.job_title);
        if (profile.phone_number) setPhoneNumber(profile.phone_number);
        if (profile.company_website) setCompanyWebsite(profile.company_website);

      } catch {
        // Session or profile failed — show form with blank defaults
        if (mounted) setChecking(false);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!fullName.trim() || !country.trim() || !organizationName.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace("/auth");
        return;
      }

      const token = session.access_token;

      const payload: CreateProfileRequest = {
        full_name: fullName.trim(),
        country: country.trim(),
        organization_name: organizationName.trim(),
        job_title: jobTitle.trim() || undefined,
        phone_number: phoneNumber.trim() || undefined,
        company_website: companyWebsite.trim() || undefined,
      };

      await completeUserProfile(token, payload);
      router.push("/chat");
    } catch (err: any) {
      setError(err?.message ?? "Unable to save your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <span className="w-8 h-8 border-2 border-[#FADD53] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#A8A8A9]">Checking your profile...</p>
        </div>
      </main>
    );
  }

  return (
    <ErrorBoundary>
      <OfflineBanner />

      <section className="relative min-h-screen hero-glow flex items-center overflow-hidden">
        {/* Background radial gold glow */}
        <div
          className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(250,221,83,0.05) 0%, rgba(209,4,0,0.02) 40%, transparent 70%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.012] z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(250,221,83,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(250,221,83,0.6) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12">
          <div className="grid gap-12 lg:grid-cols-[1fr,1.1fr] lg:items-center lg:gap-16">

            {/* Left: Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] glass-card gold-border-glow text-[#FADD53]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FADD53] animate-pulse" />
                  Step 1 of 2
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.5rem] leading-[1.1]"
              >
                Complete your{" "}
                <span className="metallic-text">
                  Profile
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 max-w-lg text-base text-[#A8A8A9] leading-relaxed sm:text-lg"
              >
                Tell us a bit about you and your organization so we can ask fewer,
                more relevant questions during your AI-guided Stevie Awards journey.
              </motion.p>
            </div>

            {/* Right: Form Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center w-full"
            >
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(250,221,83,0.08) 0%, transparent 60%)",
                }}
              />

              <div className="relative z-10 w-full rounded-2xl glass-card gold-border-glow gold-glow overflow-hidden">
                {/* Gold top stripe */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FADD53] to-transparent opacity-50" />
                <div className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Required Fields ── */}
                    <div>
                      <p className="section-label mb-4">Required Information</p>
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                              Full Name <span className="text-[#D10400]">*</span>
                            </label>
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="input-premium"
                              required
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                              Email
                            </label>
                            <input
                              type="email"
                              value={email}
                              disabled
                              className="input-premium"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                              Country <span className="text-[#D10400]">*</span>
                            </label>
                            <select
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="input-premium"
                              required
                            >
                              <option value="" className="bg-black text-zinc-400">
                                Select your country
                              </option>
                              {COUNTRIES.map((c) => (
                                <option key={c} value={c} className="bg-black text-zinc-100">
                                  {c}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                              Organization Name <span className="text-[#D10400]">*</span>
                            </label>
                            <input
                              type="text"
                              value={organizationName}
                              onChange={(e) => setOrganizationName(e.target.value)}
                              className="input-premium"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Optional Fields ── */}
                    <div>
                      <p className="section-label mb-4">Optional Details</p>
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                              Job Title
                            </label>
                            <input
                              type="text"
                              value={jobTitle}
                              onChange={(e) => setJobTitle(e.target.value)}
                              placeholder="e.g. CEO, Marketing Manager"
                              className="input-premium"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="input-premium"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            Company Website
                          </label>
                          <input
                            type="url"
                            value={companyWebsite}
                            onChange={(e) => setCompanyWebsite(e.target.value)}
                            placeholder="https://"
                            className="input-premium"
                          />
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/[0.20]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <p className="text-[13px] text-red-400" role="alert">{error}</p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
                      <p className="text-[11px] text-[#A8A8A9]/60 max-w-[220px] leading-relaxed">
                        You&apos;ll only need to do this once. Update details later from your profile.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-gold inline-flex min-h-[46px] shrink-0 items-center justify-center rounded-xl px-8 py-2 text-xs font-bold uppercase tracking-[0.1em] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#FADD53]/50 shadow-[0_4px_20px_rgba(250,221,83,0.2)]"
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </span>
                        ) : (
                          <span>Complete Profile →</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}
