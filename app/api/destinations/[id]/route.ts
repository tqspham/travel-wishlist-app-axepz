import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface Destination {
  id: string;
  name: string;
  description: string;
  image_url: string;
  visited: boolean;
  created_at: string;
  updated_at: string;
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
    const { id } = await context.params;
    const body = await _req.json();
    const { name, description, visited } = body;

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
    const { id } = await context.params;

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
