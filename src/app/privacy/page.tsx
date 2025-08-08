import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - MoneyTracker",
  description:
    "Learn how MoneyTracker collects, uses, and protects your data. Read our privacy policy for details on data handling, security, and your rights.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[70vh] w-full">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/70 mb-8">Last updated: August 8, 2025</p>

          <div className="space-y-6 text-white/90">
            <p>
              MoneyTracker ("we", "us", or "our") is committed to protecting your
              privacy. This Privacy Policy explains what information we collect, how we
              use it, and the choices you have.
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-2">Information we collect</h2>
              <ul className="list-disc pl-5 space-y-1 text-white/85">
                <li>
                  Account details: email address, name (if provided), and authentication
                  identifiers.
                </li>
                <li>
                  App data you add: transaction descriptions, amounts, tags, and related timestamps.
                </li>
                <li>
                  Technical data: device/browser information and basic logs used for security and reliability.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">How we use your information</h2>
              <ul className="list-disc pl-5 space-y-1 text-white/85">
                <li>To provide, maintain, and improve MoneyTracker features.</li>
                <li>To authenticate you and secure your account.</li>
                <li>To analyze usage and enhance performance and reliability.</li>
                <li>To communicate important updates and service notices.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Legal bases</h2>
              <p className="text-white/85">
                We process data where necessary to perform our contract with you, where we have
                a legitimate interest (such as securing our services), and where required to
                comply with legal obligations. Where applicable, we rely on your consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Data sharing</h2>
              <p className="text-white/85">
                We do not sell your personal data. We may share information with service
                providers that help us operate our app (e.g., hosting, databases, analytics),
                under contracts that require appropriate safeguards. We may disclose information
                if required by law or to protect our rights and users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Data retention</h2>
              <p className="text-white/85">
                We retain your data for as long as your account is active or as needed to
                provide the service. You can request deletion of your account data as described
                below. We may retain limited information to comply with legal obligations,
                resolve disputes, and enforce agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Security</h2>
              <p className="text-white/85">
                We use industry-standard measures to protect your data. However, no method of
                transmission or storage is 100% secure, and we cannot guarantee absolute
                security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Your rights</h2>
              <p className="text-white/85">
                Depending on your location, you may have rights to access, correct, export, or
                delete your personal data, and to object to or restrict certain processing.
                To exercise these rights, contact us using the details below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Children’s privacy</h2>
              <p className="text-white/85">
                MoneyTracker is not directed to children under 13, and we do not knowingly
                collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">International transfers</h2>
              <p className="text-white/85">
                If your data is transferred across borders, we implement safeguards to protect
                it in accordance with applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Changes to this policy</h2>
              <p className="text-white/85">
                We may update this Privacy Policy from time to time. We will update the
                "Last updated" date above and, where appropriate, provide additional notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Contact us</h2>
              <p className="text-white/85">
                If you have questions or requests regarding this Privacy Policy, contact us at
                <span className="ml-1 underline">moneytracker@nothanks.foo</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
