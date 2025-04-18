import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const protectedApps = pgTable("protected_apps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  disguiseType: text("disguise_type").notNull().default("hide"),
  disguiseAs: text("disguise_as"),
  disguiseIcon: text("disguise_icon"),
  clearChats: boolean("clear_chats").default(false),
  logOut: boolean("log_out").default(false),
});

export const insertProtectedAppSchema = createInsertSchema(protectedApps).omit({
  id: true,
  userId: true,
});

export type InsertProtectedApp = z.infer<typeof insertProtectedAppSchema>;
export type ProtectedApp = typeof protectedApps.$inferSelect;

export const panicSettings = pgTable("panic_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  // General settings
  autoHideApp: boolean("auto_hide_app").notNull().default(true),
  exitPassword: boolean("exit_password").notNull().default(false),
  enableNotifications: boolean("enable_notifications").notNull().default(true),
  // Trigger settings
  gestureType: text("gesture_type").notNull().default("triple_swipe_up"),
  triggerType: text("trigger_type").notNull().default("long_press"),
  triggerPosition: text("trigger_position").notNull().default("bottom_right"),
  triggerSensitivity: integer("trigger_sensitivity").notNull().default(15), // in tenths of a second
  swipeCount: integer("swipe_count").notNull().default(3),
  holdDuration: integer("hold_duration").notNull().default(10), // in tenths of a second (1.0s = 10)
  workWithScreenLocked: boolean("work_with_screen_locked").notNull().default(true),
  vibrationFeedback: boolean("vibration_feedback").notNull().default(true),
  keyboardShortcut: boolean("keyboard_shortcut").notNull().default(false),
  // Clean-up settings
  clearBrowserTabs: boolean("clear_browser_tabs").notNull().default(true),
  clearClipboard: boolean("clear_clipboard").notNull().default(true),
  clearBrowserHistory: boolean("clear_browser_history").notNull().default(true),
  burnMode: boolean("burn_mode").notNull().default(false),
  // Decoy settings
  decoyType: text("decoy_type").notNull().default("fake_lock_screen"),
  randomizeDecoy: boolean("randomize_decoy").notNull().default(false),
  fakeSystemAlert: boolean("fake_system_alert").notNull().default(true),
  systemAlertType: text("system_alert_type").notNull().default("low_battery"),
  disableNotifications: boolean("disable_notifications").notNull().default(true),
  randomizeExternalSite: boolean("randomize_external_site").notNull().default(false),
  // Long press zone settings
  enableLongPressZone: boolean("enable_long_press_zone").notNull().default(false),
  longPressZoneLocation: text("long_press_zone_location").notNull().default("bottom_right"),
  longPressDuration: integer("long_press_duration").notNull().default(15), // in tenths of a second (1.5s = 15)
  // Fake lock screen
  enableFakeLockScreen: boolean("enable_fake_lock_screen").notNull().default(false),
  // Timed panic
  enableTimedPanic: boolean("enable_timed_panic").notNull().default(false),
  delayedPanicEnabled: boolean("delayed_panic_enabled").notNull().default(false),
  delayedPanicMinutes: integer("delayed_panic_minutes").notNull().default(5),
  // Accessibility settings
  accessibilityMode: boolean("accessibility_mode").notNull().default(false),
  showTriggerZones: boolean("show_trigger_zones").notNull().default(false),
  highContrastMode: boolean("high_contrast_mode").notNull().default(false),
  highContrast: boolean("high_contrast").notNull().default(false),
  largerText: boolean("larger_text").notNull().default(false),
  reduceMotion: boolean("reduce_motion").notNull().default(false),
  enableKeyboardTriggers: boolean("enable_keyboard_triggers").notNull().default(false),
  keyboardTriggerKey: text("keyboard_trigger_key").notNull().default("Escape"),
  enableVoiceInstructions: boolean("enable_voice_instructions").notNull().default(false),
});

export const insertPanicSettingsSchema = createInsertSchema(panicSettings).omit({
  id: true,
  userId: true,
});

export type InsertPanicSettings = z.infer<typeof insertPanicSettingsSchema>;
export type PanicSettings = typeof panicSettings.$inferSelect;
