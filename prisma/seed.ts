import { PrismaClient, UserRole, PostType, PostStatus, PageViewEntityType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create users
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = await bcrypt.hash("admin123", 10);
  const authorPassword = await bcrypt.hash("author123", 10);
  const memberPassword = await bcrypt.hash("member123", 10);

  // If ADMIN_EMAIL is set, migrate existing admin from admin@example.com
  if (process.env.ADMIN_EMAIL) {
    await prisma.user.updateMany({
      where: { email: "admin@example.com", role: UserRole.ADMIN },
      data: { email: adminEmail },
    });
  }

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: adminPassword,
      name: process.env.ADMIN_NAME || "Admin User",
      role: UserRole.ADMIN,
      bio: "Platform administrator.",
    },
  });

  const author = await prisma.user.upsert({
    where: { email: "author@example.com" },
    update: {},
    create: {
      email: "author@example.com",
      passwordHash: authorPassword,
      name: "Jane Author",
      role: UserRole.AUTHOR,
      bio: "Writer and analyst. Interested in policy design and data storytelling.",
    },
  });

  const member = await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: {
      email: "member@example.com",
      passwordHash: memberPassword,
      name: "John Member",
      role: UserRole.MEMBER,
      bio: "Community member and reader.",
    },
  });

  console.log("Created users:", admin.email, author.email, member.email);

  // 2. Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: "policy" }, update: {}, create: { name: "Policy", slug: "policy" } }),
    prisma.tag.upsert({ where: { slug: "inequality" }, update: {}, create: { name: "Inequality", slug: "inequality" } }),
    prisma.tag.upsert({ where: { slug: "machine-learning" }, update: {}, create: { name: "Machine Learning", slug: "machine-learning" } }),
    prisma.tag.upsert({ where: { slug: "data-analysis" }, update: {}, create: { name: "Data Analysis", slug: "data-analysis" } }),
  ]);

  // 3. Create posts
  const post1 = await prisma.post.upsert({
    where: { slug: "understanding-policy-design" },
    update: {},
    create: {
      authorId: author.id,
      title: "Understanding Policy Design",
      slug: "understanding-policy-design",
      subtitle: "A framework for evaluating public interventions",
      content: `# Introduction

Policy design is the art and science of crafting interventions that achieve desired outcomes while minimizing unintended consequences.

## Key Principles

1. **Evidence-based**: Ground decisions in data and research.
2. **Iterative**: Policies should be tested and refined.
3. **Inclusive**: Stakeholder input improves outcomes.

## Conclusion

Effective policy design requires a blend of analytical rigor and practical wisdom.`,
      type: PostType.ANALYSIS,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2024-01-15"),
      readingTimeMinutes: 8,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: "housing-inequality-case-study" },
    update: {},
    create: {
      authorId: author.id,
      title: "Housing Inequality: A Case Study",
      slug: "housing-inequality-case-study",
      subtitle: "Examining disparities in urban housing access",
      content: `# Case Study Overview

This analysis examines housing disparities across major metropolitan areas.

## Methodology

We used census data and survey responses to map access to affordable housing.

## Findings

- Significant geographic variation in affordability
- Disparities correlate with historical redlining patterns
- Policy recommendations include targeted subsidies and zoning reform`,
      type: PostType.CASE_STUDY,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2024-02-01"),
      readingTimeMinutes: 12,
    },
  });

  const post3 = await prisma.post.upsert({
    where: { slug: "quick-note-on-ml-bias" },
    update: {},
    create: {
      authorId: author.id,
      title: "A Quick Note on ML Bias",
      slug: "quick-note-on-ml-bias",
      subtitle: "Why fairness metrics matter",
      content: `Machine learning models can amplify existing biases in training data. Practitioners should:

- Audit datasets for representative coverage
- Use multiple fairness metrics
- Consider downstream impacts on vulnerable groups`,
      type: PostType.NOTE,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2024-02-10"),
      readingTimeMinutes: 3,
    },
  });

  // Link posts to tags
  await prisma.postTag.createMany({
    data: [
      { postId: post1.id, tagId: tags[0].id },
      { postId: post1.id, tagId: tags[1].id },
      { postId: post2.id, tagId: tags[1].id },
      { postId: post2.id, tagId: tags[3].id },
      { postId: post3.id, tagId: tags[2].id },
    ],
    skipDuplicates: true,
  });

  // 4. Create topics
  const topicPolicy = await prisma.topic.upsert({
    where: { slug: "policy-design" },
    update: {},
    create: {
      name: "Policy Design",
      slug: "policy-design",
      description: "Articles and analysis on public policy and intervention design.",
    },
  });

  const topicInequality = await prisma.topic.upsert({
    where: { slug: "inequality" },
    update: {},
    create: {
      name: "Inequality",
      slug: "inequality",
      description: "Research and case studies on economic and social inequality.",
    },
  });

  const topicML = await prisma.topic.upsert({
    where: { slug: "machine-learning" },
    update: {},
    create: {
      name: "Machine Learning",
      slug: "machine-learning",
      description: "ML applications, ethics, and methodology.",
    },
  });

  // Link topics to posts
  await prisma.topicPost.createMany({
    data: [
      { topicId: topicPolicy.id, postId: post1.id },
      { topicId: topicInequality.id, postId: post2.id },
      { topicId: topicML.id, postId: post3.id },
    ],
    skipDuplicates: true,
  });

  // 5. Create discussions
  const discussion = await prisma.discussion.upsert({
    where: { slug: "best-practices-for-data-visualization" },
    update: {},
    create: {
      authorId: member.id,
      title: "Best practices for data visualization",
      slug: "best-practices-for-data-visualization",
      content: "What are your go-to principles when designing charts and dashboards? I'm curious about color choices, accessibility, and how to avoid misleading readers.",
    },
  });

  await prisma.discussionTag.createMany({
    data: [
      { discussionId: discussion.id, tagId: tags[3].id },
    ],
    skipDuplicates: true,
  });

  await prisma.discussionReply.create({
    data: {
      discussionId: discussion.id,
      userId: author.id,
      content: "I always start with the audience: who will see this? Then I pick a minimal color palette and ensure sufficient contrast. Tools like ColorBrewer help.",
    },
  });

  await prisma.topicDiscussion.create({
    data: { topicId: topicPolicy.id, discussionId: discussion.id },
  });

  // 6. Create a dashboard
  const dashboard = await prisma.dashboard.upsert({
    where: { slug: "sample-analytics" },
    update: {},
    create: {
      authorId: author.id,
      title: "Sample Analytics Dashboard",
      slug: "sample-analytics",
      description: "A placeholder dashboard showcasing chart integrations.",
      configJson: {
        charts: [
          { type: "line", title: "Sample Trend" },
          { type: "bar", title: "Category Comparison" },
        ],
      },
    },
  });

  await prisma.topicDashboard.create({
    data: { topicId: topicInequality.id, dashboardId: dashboard.id },
  });

  // 7. Create sample comments on post1
  const comment1 = await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: member.id,
      content: "Great framework! Have you applied this to any real-world policies?",
    },
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: author.id,
      parentCommentId: comment1.id,
      content: "Yes, we've used it in several municipal projects. I'll write a follow-up post with case studies.",
    },
  });

  await prisma.commentUpvote.create({
    data: { commentId: comment1.id, userId: author.id },
  });

  // 8. Create sample page views
  await prisma.pageView.createMany({
    data: [
      { entityType: PageViewEntityType.POST, entityId: post1.id },
      { entityType: PageViewEntityType.POST, entityId: post1.id },
      { entityType: PageViewEntityType.POST, entityId: post1.id },
      { entityType: PageViewEntityType.POST, entityId: post2.id },
      { entityType: PageViewEntityType.POST, entityId: post2.id },
      { entityType: PageViewEntityType.POST, entityId: post3.id },
      { entityType: PageViewEntityType.DASHBOARD, entityId: dashboard.id },
      { entityType: PageViewEntityType.DASHBOARD, entityId: dashboard.id },
    ],
  });

  // 9. Create a bookmark
  await prisma.bookmark.create({
    data: { userId: member.id, postId: post1.id },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
