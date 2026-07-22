import SiteSettings from "../models/SiteSettings.js";

const SETTINGS_KEY = "default";

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne({ key: SETTINGS_KEY });
  if (!settings) {
    settings = await SiteSettings.create({ key: SETTINGS_KEY, profilePhotoUrl: "" });
  }
  return settings;
}

export async function getSiteSettings(_req, res, next) {
  try {
    const settings = await getOrCreateSettings();
    res.json({
      success: true,
      data: {
        profilePhotoUrl: settings.profilePhotoUrl || "",
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateSiteSettings(req, res, next) {
  try {
    const profilePhotoUrl =
      typeof req.body?.profilePhotoUrl === "string"
        ? req.body.profilePhotoUrl.trim()
        : undefined;

    if (profilePhotoUrl === undefined) {
      return res.status(400).json({
        success: false,
        message: "profilePhotoUrl is required",
      });
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { profilePhotoUrl },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      data: {
        profilePhotoUrl: settings.profilePhotoUrl || "",
      },
    });
  } catch (err) {
    next(err);
  }
}
