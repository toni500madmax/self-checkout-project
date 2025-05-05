import Image from "next/image";
import { notFound } from "next/navigation";

import { getRestaurantBySlug } from "./../../data/get-restaurant-by-slug";
import ConsumptionMethodOption from "./components/consumption-method-option";

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const { slug } = await params;
  const restaurantFromDb = await getRestaurantBySlug(slug);

  if (!restaurantFromDb) {
    return notFound();
  }

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center px-6 pt-24">
        {/* Logo e título */}
        <div className="flex flex-col items-center gap-2">
          <Image
            src={restaurantFromDb.avatarImageUrl}
            alt={restaurantFromDb.description}
            width={82}
            height={82}
          />
          <h2 className="font-semibold">{restaurantFromDb.name}</h2>
        </div>
        {/* Bem vindo */}
        <div className="space-y-2 pt-24 text-center">Seja bem vindo!</div>
        <p className="opacity-55">
          Escolha como prefere aproveitar sua refeição. Estamos aqui para
          oferecer praticidade e sabor em cada detalhe!
        </p>
        <div className="grid grid-cols-2 gap-4 pt-14">
          <ConsumptionMethodOption
            buttonText="Para comer aqui"
            imageUrl="/dine_in.png"
            imageAlt="Comer aqui"
            option="DINE_IN"
            slug={slug}
          />
          <ConsumptionMethodOption
            buttonText="Para levar"
            imageUrl="/takeaway.png"
            imageAlt="Para levar"
            option="TAKEAWAY"
            slug={slug}
          />
        </div>
      </div>
    </>
  );
};

export default RestaurantPage;
