import { motion } from 'framer-motion';
import { Leaf, Users, Sparkles } from 'lucide-react';


export default function About() {
  return (
    <>
   
    <div className="min-h-screen px-6 py-12 md:px-20 lg:px-40">
      <motion.h1 
        className="text-4xl md:text-5xl font-bold text-green-800 mb-8 text-center"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        À propos de Plantélys
      </motion.h1>

      <motion.div 
        className="bg-white rounded-2xl shadow-xl p-8 grid gap-10 md:grid-cols-3"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="flex flex-col items-center text-center">
          <Leaf className="w-12 h-12 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Une passion pour la nature</h2>
          <p className="text-gray-600">
            Nous proposons une large gamme de plantes d'intérieur et d'extérieur, avec des conseils pour les entretenir au quotidien.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <Users className="w-12 h-12 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Une communauté engagée</h2>
          <p className="text-gray-600">
            Partagez vos astuces, posez des questions et connectez-vous avec d'autres passionnés dans notre espace communautaire.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <Sparkles className="w-12 h-12 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Un accompagnement personnalisé</h2>
          <p className="text-gray-600">
            Recevez des rappels d’arrosage et des notifications d’entretien selon vos plantes pour les garder en pleine santé.
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p className="text-lg text-gray-700">
          Chez <span className="text-green-700 font-semibold">Plantélys</span>, notre mission est de rendre le jardinage accessible, éducatif et inspirant pour tous.
        </p>
      </motion.div>
    </div>
     </>
  );
}
