import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    user: v.id("users"),
  }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    // clerkId: v.string(),
    givenName: v.optional(v.string()),
    familyName: v.optional(v.string()),
    nickname: v.optional(v.string()),
    preferredUsername: v.optional(v.string()),
    profileUrl: v.optional(v.string()),
    pictureUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    gender: v.optional(v.string()),
    birthday: v.optional(v.string()),
    timezone: v.optional(v.string()),
    language: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    phoneNumberVerified: v.optional(v.boolean()),
    address: v.optional(v.string()),
    updatedAt: v.optional(v.string()),

  }).index("by_token", ["tokenIdentifier"]),
});