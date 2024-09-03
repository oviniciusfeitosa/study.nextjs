import { mutation } from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    // Note: If you don't want to define an index right away, you can use
    // ctx.db.query("users")
    //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    //  .unique();
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

      console.log("user", user);
      
    // const user = await ctx.db.query("users")
    // .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    // .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      if (user.givenName !== identity.givenName) {
        await ctx.db.patch(user._id, { givenName: identity.givenName });
      }
      if (user.familyName !== identity.familyName) {
        await ctx.db.patch(user._id, { familyName: identity.familyName });
      }
      if (user.nickname !== identity.nickname) {
        await ctx.db.patch(user._id, { nickname: identity.nickname });
      }
      if (user.preferredUsername !== identity.preferredUsername) {
        await ctx.db.patch(user._id, { preferredUsername: identity.preferredUsername });
      }
      if (user.profileUrl !== identity.profileUrl) {
        await ctx.db.patch(user._id, { profileUrl: identity.profileUrl });
      }
      if (user.pictureUrl !== identity.pictureUrl) {
        await ctx.db.patch(user._id, { pictureUrl: identity.pictureUrl });
      }
      if (user.email !== identity.email) {
        await ctx.db.patch(user._id, { email: identity.email });
      }
      if (user.emailVerified !== identity.emailVerified) {
        await ctx.db.patch(user._id, { emailVerified: identity.emailVerified });
      }
      if (user.gender !== identity.gender) {
        await ctx.db.patch(user._id, { gender: identity.gender });
      }
      if (user.birthday !== identity.birthday) {
        await ctx.db.patch(user._id, { birthday: identity.birthday });
      }
      if (user.timezone !== identity.timezone) {
        await ctx.db.patch(user._id, { timezone: identity.timezone });
      }
      if (user.language !== identity.language) {
        await ctx.db.patch(user._id, { language: identity.language });
      }
      if (user.phoneNumber !== identity.phoneNumber) {
        await ctx.db.patch(user._id, { phoneNumber: identity.phoneNumber });
      }
      if (user.phoneNumberVerified !== identity.phoneNumberVerified) {
        await ctx.db.patch(user._id, { phoneNumberVerified: identity.phoneNumberVerified });
      }
      if (user.address !== identity.address) {
        await ctx.db.patch(user._id, { address: identity.address });
      }
      if (user.updatedAt !== identity.updatedAt) {
        await ctx.db.patch(user._id, { updatedAt: identity.updatedAt });
      }
      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      tokenIdentifier: identity.tokenIdentifier,
      givenName: identity.givenName,
      familyName: identity.familyName,
      nickname: identity.nickname,
      preferredUsername: identity.preferredUsername,
      profileUrl: identity.profileUrl,
      pictureUrl: identity.pictureUrl,
      email: identity.email,
      emailVerified: identity.emailVerified,
      gender: identity.gender,
      birthday: identity.birthday,
      timezone: identity.timezone,
      language: identity.language,
      phoneNumber: identity.phoneNumber,
      phoneNumberVerified: identity.phoneNumberVerified,
      address: identity.address,
      updatedAt: identity.updatedAt,
    });
  },
});