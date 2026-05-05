import mongoose from "mongoose";

const caseStudySectionSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const caseStudySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    heroImage: { type: String, default: "" },
    sections: [caseStudySectionSchema],
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

caseStudySchema.virtual("attachments", {
  ref: "File",
  localField: "_id",
  foreignField: "parentId",
  match: { parentType: "case-study" },
});

const CaseStudy = mongoose.model("CaseStudy", caseStudySchema);
export default CaseStudy;

