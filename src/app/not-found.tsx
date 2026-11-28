import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="pb-card w-full max-w-xl p-6 text-center">
        <h1 className="pb-page-title">Page Not Found</h1>
        <p className="mt-4">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/" className="pb-link mt-6 inline-flex min-h-11 items-center">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
