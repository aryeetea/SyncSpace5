import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-090a6328/health", (c) => {
  return c.json({ status: "ok" });
});

// Create a new group
app.post("/make-server-090a6328/groups", async (c) => {
  try {
    const { groupName, userName, code } = await c.req.json();
    
    if (!groupName || !userName || !code) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Check if group code already exists
    const existingGroup = await kv.get(`group:${code}`);
    if (existingGroup) {
      return c.json({ error: "Group code already exists" }, 409);
    }

    // Create the group
    const group = {
      name: groupName,
      code,
      createdAt: new Date().toISOString()
    };
    await kv.set(`group:${code}`, group);

    // Add creator as first member
    const memberId = crypto.randomUUID();
    const member = {
      id: memberId,
      name: userName,
      joinedAt: new Date().toISOString()
    };
    await kv.set(`group:${code}:members`, [member]);

    return c.json({ 
      success: true, 
      group, 
      memberId 
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return c.json({ error: 'Failed to create group', details: String(error) }, 500);
  }
});

// Join an existing group
app.post("/make-server-090a6328/groups/:code/join", async (c) => {
  try {
    const { code } = c.req.param();
    const { userName } = await c.req.json();

    if (!userName) {
      return c.json({ error: "Username is required" }, 400);
    }

    // Check if group exists
    const group = await kv.get(`group:${code}`);
    if (!group) {
      return c.json({ error: "Group not found" }, 404);
    }

    // Get current members
    const members = await kv.get(`group:${code}:members`) || [];

    // Add new member
    const memberId = crypto.randomUUID();
    const newMember = {
      id: memberId,
      name: userName,
      joinedAt: new Date().toISOString()
    };
    members.push(newMember);
    await kv.set(`group:${code}:members`, members);

    return c.json({ 
      success: true, 
      group, 
      memberId 
    });
  } catch (error) {
    console.error('Error joining group:', error);
    return c.json({ error: 'Failed to join group', details: String(error) }, 500);
  }
});

// Get group data with all members and their availability
app.get("/make-server-090a6328/groups/:code", async (c) => {
  try {
    const { code } = c.req.param();

    // Get group info
    const group = await kv.get(`group:${code}`);
    if (!group) {
      return c.json({ error: "Group not found" }, 404);
    }

    // Get all members
    const members = await kv.get(`group:${code}:members`) || [];

    // Get availability for each member
    const membersWithAvailability = await Promise.all(
      members.map(async (member: any) => {
        const availability = await kv.get(`group:${code}:member:${member.id}:availability`);
        return {
          ...member,
          availability: availability || null
        };
      })
    );

    return c.json({
      group,
      members: membersWithAvailability
    });
  } catch (error) {
    console.error('Error fetching group:', error);
    return c.json({ error: 'Failed to fetch group', details: String(error) }, 500);
  }
});

// Update user's availability
app.put("/make-server-090a6328/groups/:code/availability", async (c) => {
  try {
    const { code } = c.req.param();
    const { memberId, availability } = await c.req.json();

    if (!memberId || !availability) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Verify group exists
    const group = await kv.get(`group:${code}`);
    if (!group) {
      return c.json({ error: "Group not found" }, 404);
    }

    // Verify member exists
    const members = await kv.get(`group:${code}:members`) || [];
    const memberExists = members.some((m: any) => m.id === memberId);
    if (!memberExists) {
      return c.json({ error: "Member not found in group" }, 404);
    }

    // Save availability
    await kv.set(`group:${code}:member:${memberId}:availability`, availability);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating availability:', error);
    return c.json({ error: 'Failed to update availability', details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);