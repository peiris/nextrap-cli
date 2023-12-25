import * as React from "react";
import { type EmblaCarouselType as CarouselApi, type EmblaOptionsType as CarouselOptions, type EmblaPluginType as CarouselPlugin } from "embla-carousel-react";
type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin[];
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
};
declare const Carousel: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & CarouselProps & React.RefAttributes<HTMLDivElement>>;
declare const CarouselContent: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CarouselItem: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
declare const CarouselPrevious: React.ForwardRefExoticComponent<any>;
declare const CarouselNext: React.ForwardRefExoticComponent<any>;
export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, };
