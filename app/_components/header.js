import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/app/_components/Search";
import FileUploader from "@/app/_components/FileUploader";
import { signOutUser } from "@/app/_lib/actions/userActions";

const Header = ({ userId, accountId }) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId} />
        <form
          action={async () => {
            "use server";

            await signOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
