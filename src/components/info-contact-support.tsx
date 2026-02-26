import { Mail, MessageSquare, Github, Linkedin } from "lucide-react";

export function InfoContactSupport() {
  const contactItems = [
    {
      icon: MessageSquare,
      title: "Report a Bug",
      description: "Found an issue? Let us know so we can fix it.",
      action: "Report Bug",
      href: "mailto:support@skitracker.com?subject=Bug Report",
    },
    {
      icon: Mail,
      title: "Feature Request",
      description: "Have an idea? We'd love to hear your suggestions.",
      action: "Request Feature",
      href: "mailto:support@skitracker.com?subject=Feature Request",
    },
    {
      icon: Github,
      title: "GitHub",
      description: "Check out our code and contribute to the project.",
      action: "View on GitHub",
      href: "https://github.com/sasmuli",
      external: true,
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      description: "Connect with me professionally on LinkedIn.",
      action: "View Profile",
      href: "https://www.linkedin.com/in/samuli-virkkula",
      external: true,
    },
  ];

  return (
    <section style={{ paddingBottom: '4rem' }}>
      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
        Contact & Support
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contactItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="glass-card p-5 rounded-lg border border-[rgba(255,255,255,0.1)] hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[rgba(255,255,255,0.05)] rounded-lg">
                  <Icon className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">
                    {item.description}
                  </p>
                  <a
                    href={item.href}
                    className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    {item.action}
                    {item.external && (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    )}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-4 glass-card rounded-lg border border-[rgba(255,255,255,0.1)] text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          For general inquiries, contact us at{" "}
          <a
            href="mailto:hello@skitracker.com"
            className="text-[var(--accent)] hover:underline"
          >
            hello@skitracker.com
          </a>
        </p>
      </div>
    </section>
  );
}
