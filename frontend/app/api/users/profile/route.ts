import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize a supabase client using service role key if available, otherwise just anon.
// We'll trust the token passed in Authorization for the user context.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${token}` } },
        });

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Try to fetch from a generic profiles table if it exists
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
            // If table doesn't exist or profile not found, return 404
            return NextResponse.json({ message: "PROFILE_NOT_FOUND" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: profile });
    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${token}` } },
        });

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Prepare profile data
        const profileData = {
            id: user.id, // Usually the primary key linking to auth.users
            full_name: body.full_name,
            country: body.country,
            organization_name: body.organization_name,
            job_title: body.job_title,
            phone_number: body.phone_number,
            company_website: body.company_website,
            has_completed_onboarding: true,
            updated_at: new Date().toISOString(),
        };

        // Upsert profile in 'profiles' table
        const { data: updatedProfile, error: upsertError } = await supabase
            .from("profiles")
            .upsert(profileData)
            .select()
            .single();

        if (upsertError) {
            return NextResponse.json(
                { message: upsertError.message || "Failed to update profile." },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            user: updatedProfile,
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
