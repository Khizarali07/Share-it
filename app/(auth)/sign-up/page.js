import AuthForm from "@/app/_components/Authform";

function page() {
  return (
    <div className="flex justify-center items-center w-screen xl:w-[60vw] lg:w-[50vw] h-full">
      <AuthForm type="sign-up" />
    </div>
  );
}

export default page;
