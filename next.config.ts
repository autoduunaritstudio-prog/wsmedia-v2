import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Next 16 muutti oletuksen: images.qualities on nyt [75], ja
       quality-proppi joka ei ole listalla PAKOTETAAN lahimpaan
       sallittuun - hiljaa, ilman buildvirhetta.

       Case-korttien kuvat on viety q88:lla ja niiden SSIM lahteeseen on
       0,9838. Optimoijan oletus q75 pudottaisi sen 0,9585:een eli alle
       projektin rajan 0,975 (mitattu: sharp, sama kutsu kuin
       image-optimizer.js).

       Tama on pelkka SALLITTUJEN arvojen lista, ei laadunkorotus: yksikaan
       muu <Image> ei aseta quality-proppia, joten ne kayttavat edelleen
       oletusta 75 eika yhdenkaan muun kuvan paino muutu. */
    qualities: [75, 88],
  },
};

export default nextConfig;
