import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import {
  PUBLISH_STATUS_OPTIONS,
  PUBLISH_STATUS,
} from "@/constants/shared/status";

export const SLIDER_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Website & PR", href: "/website/sliders" },
  { title: "Visual Banners", href: "/website/sliders" },
];

export const SLIDER_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "image", label: "Image" },
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "sort_order", label: "Order" },
  { key: "action", label: "Actions" },
];

export const SLIDER_FORM_INITIAL_DATA = {
  title: "",
  description: "",
  image_url: "",
  button_caption: "",
  button_url: "",
  status: PUBLISH_STATUS.PUBLISHED,
  sort_order: 0,
};

export const SLIDER_DIALOG_FORM_LAYOUT = [
  {
    name: "title",
    label: "Title / Heading",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Admissions Open 2025-26",
    required: true,
    maxLength: 150,
    tooltip: "Main headline displayed on the banner. Keep it short for readability.",
  },
  {
    name: "description",
    label: "Short Description",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "e.g. Apply by 30 April. Eligibility and link below.",
    maxLength: 500,
    tooltip: "Brief text below the title. HTML is supported for links or formatting.",
    helperText: "HTML formatting is supported",
  },
  {
    name: "image_url",
    label: "Banner Image",
    type: FORM_TYPE.FILE,
    accept: "image/*",
    required: true,
    placeholder: "e.g. Upload banner image",
    tooltip: "High-quality image for the slide. Use 16:9 for best display.",
    helperText: "Recommended: 1920x1080px (16:9 aspect ratio)",
  },
  {
    name: "button_caption",
    label: "Button Caption",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Learn More, Apply Now",
    maxLength: 50,
    tooltip: "Text on the call-to-action button. Leave blank to hide the button.",
  },
  {
    name: "button_url",
    label: "Button URL",
    type: FORM_TYPE.TEXT,
    placeholder: "https://example.com/page",
    maxLength: 500,
    tooltip: "URL opened when the button is clicked. Use full URL with https://.",
    helperText: "Enter full URL with https://",
  },
  {
    name: "sort_order",
    label: "Sort Order",
    type: FORM_TYPE.NUMBER,
    placeholder: "e.g. 0",
    tooltip: "Order in the carousel. Lower numbers appear first.",
    helperText: "Lower numbers appear first",
  },
  {
    name: "status",
    label: "Status",
    type: FORM_TYPE.SELECT,
    options: [...PUBLISH_STATUS_OPTIONS],
    tooltip: "Published: visible on website. Draft: hidden until you publish.",
  },
];
