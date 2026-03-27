export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <header
      className={`mb-8 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {eyebrow ? (
        <p className="text-sm font-medium tracking-wide text-indigo-300/90">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90">
          {description}
        </p>
      ) : null}
    </header>
  );
}

