import LogoOrange from "@/assets/images/logo-orange.svg";
import LogoBlack from "@/assets/images/logo-black.svg";
import LogoWhite from "@/assets/images/logo-white.svg";
import Image from "next/image";

type LogoColor = "orange" | "black" | "white";
type LogoSize = "small" | "medium" | "large";

interface LogoProps {
    color?: LogoColor;
    size?: LogoSize;
};

const logoSources : Record<LogoColor, string> = {
    orange: LogoOrange,
    black: LogoBlack,
    white: LogoWhite
};

const logoWidth : Record<LogoSize, number> = {
    small : 100,
    medium : 147,
    large : 252
};

function Logo({ color = "orange", size = "medium" } : LogoProps) {
    return (
        <Image
            src={logoSources[color]}
            alt="Abricot"
            width={logoWidth[size]}
        />
    );
};


export default Logo;