import {

    notification2,
    notification3,
    notification4,
    homeSmile,
    plusSquare,
    file02,
    searchMd,
    benefitIcon1,
    benefitIcon2,
    benefitIcon3,
    discordBlack,
    twitter,
    instagram,
    telegram,
    facebook

} from "../assets";

export const navigation = [
    {
        id: "0",
        title: "Features",
        url: "#features",
    },
    {
        id: "1",
        title: "Pricing",
        url: "#pricing",
    },
    {
        id: "2",
        title: "How to use",
        url: "#how-to-use",
    },
    {
        id: "3",
        title: "Roadmap",
        url: "#roadmap",
    },
    {
        id: "4",
        title: "New account",
        url: "#signup",
        onlyMobile: true,
    },
    {
        id: "5",
        title: "Sign in",
        url: "#login",
        onlyMobile: true,
    },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const login = [

    {
        id: "0",
        title: "Login to your Account",
        backgroundUrl: "src/assets/card-1.svg"

    }

]

export const register = [

    {
        id: "0",
        title: "Create new Account",
        backgroundUrl: "src/assets/card-2.svg"

    }
]

export const benefits = [
    {
        id: "0",
        title: "Join your course",
        text: "Join your course and always be up to date with homework and assignments",
        backgroundUrl: "./src/assets/card-1.svg",
        iconUrl: benefitIcon1,

    },
    {
        id: "1",
        title: "Ask Questions",
        text: "You can ask questions within your course. If you get stuck with a task, your course colleagues can help you.",
        backgroundUrl: "./src/assets/card-2.svg",
        iconUrl: benefitIcon2,

        light: true,
    },
    {
        id: "2",
        title: "Everything in one place",
        text: "All your subjects are collected in this place. Notes and course materials, homework and important documents relating to your dual study programme",
        backgroundUrl: "./src/assets/card-3.svg",
        iconUrl: benefitIcon3,

    },
];

export const socials = [
    {
        id: "0",
        title: "Discord",
        iconUrl: discordBlack,
        url: "#",
    },
    {
        id: "1",
        title: "Twitter",
        iconUrl: twitter,
        url: "#",
    },
    {
        id: "2",
        title: "Instagram",
        iconUrl: instagram,
        url: "#",
    },
    {
        id: "3",
        title: "Telegram",
        iconUrl: telegram,
        url: "#",
    },
    {
        id: "4",
        title: "Facebook",
        iconUrl: facebook,
        url: "#",
    },
];

