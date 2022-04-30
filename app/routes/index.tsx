import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-slate-50 sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="h-screen mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="object-cover w-full h-full"
                src="./img/trash_truck.jpg"
                alt="Ada with a trash truck"
              />
            </div>
            <div className="relative px-4 pt-32 pb-8 lg:pb-18 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32">
              <h1 className="text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl">
                <span className="block text-pink-500 uppercase drop-shadow-md">
                  Finny
                </span>
              </h1>

              <div className="max-w-sm mx-auto mt-10 sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <Link
                    to="/spends"
                    className="flex items-center justify-center px-4 py-3 text-base font-medium text-pink-700 bg-white border border-transparent rounded-md shadow-sm hover:bg-pink-50 sm:px-8"
                  >
                    View Spends for {user.email}
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/join"
                      className="flex items-center justify-center px-4 py-3 text-base font-medium text-pink-700 bg-white border border-transparent rounded-md shadow-sm hover:bg-pink-50 sm:px-8"
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center px-4 py-3 font-medium text-white bg-pink-500 rounded-md hover:bg-pink-600 "
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 mt-6">
            {[
              {
                src: "./img/github.png",
                alt: "Github.com",
                href: "https://github.com/pqmcgill/finny",
              },
            ].map((img) => (
              <a
                key={img.href}
                href={img.href}
                className="flex justify-center w-32 h-16 p-1 transition grayscale hover:grayscale-0 focus:grayscale-0"
              >
                <img alt={img.alt} src={img.src} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
