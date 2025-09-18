import React from "react";


const CGU = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Mentions légales & Conditions Générales d’Utilisation</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
          <p>Plantélys - Société fictive à but éducatif<br />
          Email : contact@plantelys.fr<br />
          Téléphone : +33 1 23 45 67 89</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
          <p>
            Le site est hébergé par une plateforme de développement local ou un fournisseur cloud.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Données personnelles</h2>
          <p>
            Les données collectées sont utilisées uniquement pour le traitement des commandes
            et la gestion de la relation client. Conformément à la loi « Informatique et Libertés », vous disposez
            d’un droit d’accès, de rectification et de suppression de vos données.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Utilisation du site</h2>
          <p>
            Toute reproduction ou utilisation non autorisée des contenus (textes, images, etc.)
            est strictement interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Responsabilité</h2>
          <p>
            Plantélys ne peut être tenu responsable en cas de dysfonctionnement du site ou d’interruption de service.
          </p>
        </section>

        <p className="text-sm mt-8 text-gray-500">Dernière mise à jour : juin 2025</p>
      </div>
    </>
  );
};

export default CGU;
