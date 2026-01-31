"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { completeUserProfile, getUserProfile } from "@/lib/api";
import type { CreateProfileRequest, UserProfile } from "@/lib/types";

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
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session) {
          router.replace("/auth");
          return;
        }

        const token = session.access_token;
        const userEmail = session.user.email ?? "";
        if (mounted) {
          setEmail(userEmail);
        }

        try {
          const profile: UserProfile = await getUserProfile(token);
          if (!mounted) return;
          if (profile.has_completed_onboarding) {
            router.replace("/chat");
            return;
          }

          setFullName(profile.full_name ?? "");
          setCountry(profile.country ?? "");
          setOrganizationName(profile.organization_name ?? "");
          setJobTitle(profile.job_title ?? "");
          setPhoneNumber(profile.phone_number ?? "");
          setCompanyWebsite(profile.company_website ?? "");
        } catch {
          // If profile doesn't exist yet, we just keep defaults.
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
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
      <main className="flex min-h-screen items-center justify-center text-zinc-50">
        <p className="text-sm text-zinc-400">Checking your profile...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 text-zinc-50">
      <div className="w-full max-w-3xl rounded-3xl border border-zinc-800/70 bg-black/70 px-6 py-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-lg sm:px-10 sm:py-10">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
            Step 1 of 2
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-50 sm:text-3xl">
            Complete your profile
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Tell us a bit about you and your organization so we can ask fewer,
            more relevant questions during your Stevie Awards journey.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                Full Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10 rounded-full border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-50 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/70"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="h-10 cursor-not-allowed rounded-full border border-zinc-800 bg-zinc-900/70 px-4 text-sm text-zinc-400"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                Country<span className="text-red-500">*</span>
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="h-10 rounded-full border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-50 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/70"
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
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                Organization Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="h-10 rounded-full border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-50 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/70"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. CEO, Marketing Manager"
                className="h-10 rounded-full border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-50 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/70"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-10 rounded-full border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-50 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/70"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
              Company Website
            </label>
            <input
              type="url"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              placeholder="https://"
              className="h-10 rounded-full border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-50 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/70"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-[11px] text-zinc-500">
              You&apos;ll only need to do this once. You can update details later if
              they change.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-black shadow-[0_0_25px_rgba(250,204,21,0.5)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Saving..." : "Complete Profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
