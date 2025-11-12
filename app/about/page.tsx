import Hero from "@/components/about/hero"
import Vision from "@/components/about/vision"
import Mission from "@/components/about/mission"
import Community from "@/components/about/community"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

export default function AboutPage() {
  return (
    <main className="w-full">
        <Header/>
        <Hero />
        <Vision />
        <Mission />
        <Community />
        <Footer/>
    </main>
  )
}
