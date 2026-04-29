import { ToastContainer, useToast } from "./Toast";

type ContactLink = {
  label: string;
  href: string;
};

type ContactBlockProps = {
  email: string;
  links?: ContactLink[];
};

export function ContactBlock({ email, links }: ContactBlockProps) {
  const { toasts, addToast, removeToast } = useToast();

  const handleCopy = async () => {
    try {
      const writeText = navigator.clipboard?.writeText?.bind(
        navigator.clipboard,
      );

      if (!writeText) {
        throw new Error("Clipboard API unavailable");
      }

      await writeText(email);
      addToast("이메일을 복사했습니다");
    } catch {
      addToast("복사 실패 - 직접 복사하세요");
    }
  };

  return (
    <>
      <div className="contact-block">
        <button
          className="contact-block__email"
          onClick={handleCopy}
          type="button"
        >
          <span aria-hidden="true">✉</span>
          <span>{email}</span>
        </button>
        {links?.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="site-nav__link"
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  );
}
