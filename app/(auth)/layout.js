import Authside from "../_components/authside";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`__variable_e16692 font-poppins antialiased`}>
        <div className="flex min-h-[100vh]">
          <Authside />
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
