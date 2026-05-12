import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateSession } from "@/lib/session";

interface Destination {
  id: string;
  name: string;
  description: string;
  image_url: string;
  visited: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface ApiDestination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  visited: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapDbToApi(db: Destination): ApiDestination {
  return {
    id: db.id,
    name: db.name,
    description: db.description,
    imageUrl: db.image_url,
    visited: db.visited,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("auth_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = await validateSession(sessionToken);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sort = request.nextUrl.searchParams.get("sort") || "date";

    let query = supabase
      .from("travel_wishlist_app_axepz_destinations")
      .select("*")
      .eq("user_id", userId);

    if (sort === "name") {
      query = query.order("name", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch destinations" },
        { status: 500 }
      );
    }

    const destinations = (data as Destination[]).map(mapDbToApi);

    return NextResponse.json({ destinations });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("auth_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = await validateSession(sessionToken);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, imageUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Destination name is required" },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const finalImageUrl = imageUrl || "";

    const { data, error } = await supabase
      .from("travel_wishlist_app_axepz_destinations")
      .insert([
        {
          name: name.trim(),
          description: description.trim(),
          image_url: finalImageUrl,
          visited: false,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create destination" },
        { status: 500 }
      );
    }

    const destination = mapDbToApi(data as Destination);

    return NextResponse.json({ destination }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
