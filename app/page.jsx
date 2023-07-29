import Feed from "@/components/Feed"

const Home = () => {
  return (
    <>
      <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Search & Access
        <br className="max-md:hidden" />
        <span className="orange_gradient"> A Plethora Of Past Questions</span>
      </h1>
      <p className="desc text-center font-roboto">
        Studying past exams benefits students by familiarizing them with the format, identifying recurring topics, improving time management, and boosting confidence
      </p>

      <Feed />

    </section>
    </>
    
  )
}

export default Home