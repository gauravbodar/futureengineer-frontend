export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
          <span className="text-5xl mb-6 block">🎉</span>
          <h1 className="font-display font-extrabold text-navy text-2xl mb-3">
            Payment successful!
          </h1>
          <p className="font-body text-gray-500 text-base leading-relaxed mb-4">
            We're setting up your account right now. Check your inbox — you'll receive an email
            with a link to set your password and access the platform.
          </p>
          <p className="font-body text-gray-400 text-sm leading-relaxed mb-8">
            It usually arrives within a minute. Check your spam folder if you don't see it.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:hello@futureengineracademy.com"
              className="font-body text-teal font-semibold text-sm hover:text-teal-light transition-colors"
            >
              Didn't get the email? Contact us →
            </a>
            <a
              href="/"
              className="font-body text-gray-400 text-sm hover:text-gray-600 transition-colors"
            >
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
