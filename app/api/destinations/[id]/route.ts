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

export async function PATCH(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const sessionToken = _req.cookies.get("auth_session")?.value;

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

    const { id } = await context.params;
    const body = await _req.json();
    const { name, description, visited } = body;

    const { data: existingDestination, error: fetchError } = await supabase
      .from("travel_wishlist_app_axepz_destinations")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingDestination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    if (existingDestination.user_id !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      updateData.name = name;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (visited !== undefined) {
      updateData.visited = visited;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("travel_wishlist_app_axepz_destinations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update destination" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    const destination = mapDbToApi(data as Destination);

    return NextResponse.json({ destination });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const sessionToken = _req.cookies.get("auth_session")?.value;

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

    const { id } = await context.params;

    const { data: existingDestination, error: fetchError } = await supabase
      .from("travel_wishlist_app_axepz_destinations")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingDestination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    if (existingDestination.user_id !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("travel_wishlist_app_axepz_destinations")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete destination" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
