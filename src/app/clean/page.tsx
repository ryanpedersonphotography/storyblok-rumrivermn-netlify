/**
 * Clean Version Route - Semantic CSS Implementation
 *
 * This route demonstrates the site with:
 * - Semantic class names (.navbar instead of .hotfix-navbar)
 * - Token-based styling (no hardcoded values)
 * - Zero !important declarations
 * - Proper CSS cascade management
 */

import Navbar from '@/components/clean/Navbar';
import Hero from '@/components/clean/Hero';
import AlternatingBlocks from '@/components/clean/AlternatingBlocks';
import Spaces from '@/components/clean/Spaces';
import Experience from '@/components/clean/Experience';
import Gallery from '@/components/clean/Gallery';
import BrandProof from '@/components/clean/BrandProof';
import Testimonials from '@/components/clean/Testimonials';
import HistoryCarousel from '@/components/clean/HistoryCarousel';
import ScheduleForm from '@/components/clean/ScheduleForm';
import Map from '@/components/clean/Map';
import FAQ from '@/components/clean/FAQ';
import Pricing from '@/components/clean/Pricing';
import Footer from '@/components/clean/Footer';

export const metadata = {
  title: 'Rum River Barn - Clean Version',
  description: 'Wedding venue in Minnesota - Clean CSS implementation',
};

export default function CleanPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Spaces />
      <AlternatingBlocks />
      <Experience />
      <Gallery />
      <BrandProof />
      <Testimonials />
      <HistoryCarousel />
      <ScheduleForm />
      <Map />
      <FAQ />
      <Pricing />
      <Footer />
    </>
  );
}
