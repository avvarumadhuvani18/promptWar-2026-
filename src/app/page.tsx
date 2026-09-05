export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">MedLens</h1>
      <p className="mt-2 text-gray-600">
        From scattered reports to a clearer health story.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <a
          href="/intake"
          className="rounded-xl border p-6 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Patient Intake</h2>
          <p className="mt-2 text-gray-600">
            Enter and manage patient information.
          </p>
        </a>

        <a
          href="/upload"
          className="rounded-xl border p-6 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Upload Reports</h2>
          <p className="mt-2 text-gray-600">
            Upload medical reports for processing.
          </p>
        </a>

        <a
          href="/dashboard"
          className="rounded-xl border p-6 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="mt-2 text-gray-600">
            View the patient's organized health information.
          </p>
        </a>
      </div>
    </main>
  );
}