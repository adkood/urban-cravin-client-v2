const TrendingCollections = () => {
  const collections = [
    {
      id: 1,
      category: 'STYLE ESSENTIALS',
      title: 'CAPS',
      buttonText: 'SHOP NOW',
      image: 'https://cdn.shopify.com/s/files/1/1368/3463/files/fall_3x4_17e597b0-9bd9-4e13-8f81-5cb00668a186.jpg?v=1758309664&width=600&height=800&crop=center',
      link: '/collections/mens-fall-2025',
      alt: 'Man wearing a pink cap'
    },
    {
      id: 2,
      category: 'COLLECTIBLES',
      title: 'ASHTRAYS',
      buttonText: 'SHOP NOW',
      image: 'https://cdn.shopify.com/s/files/1/1368/3463/files/Floating_-_Cadet_Blue_Hyperloop_Overshirt_-_02.jpg?v=1758581543&width=600&height=800&crop=center',
      link: '/products/hyperloop-overshirt-cadet-blue',
      alt: 'Black ashtray in hand'
    },
    {
      id: 3,
      category: 'EXCLUSIVE',
      title: 'WOMENSWEAR',
      buttonText: 'SHOP HERE',
      image: 'https://cdn.shopify.com/s/files/1/1368/3463/files/jarren_duran_hero_mobile.jpg?v=1742837889&width=600&height=800&crop=center',
      link: '/collections/jarren-duran',
      alt: 'Woman wearing pink t-shirt and plaid skirt'
    }
  ];

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {collections.map((collection) => (
            <a
              key={collection.id}
              href={collection.link}
              className="relative block overflow-hidden group"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay with Text */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    {/* Category */}
                    <p className="text-xs md:text-sm font-medium tracking-widest mb-2 opacity-90">
                      {collection.category}
                    </p>
                    
                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                      {collection.title}
                    </h3>
                    
                    {/* Button */}
                    <button className="bg-white text-black text-xs md:text-sm font-semibold tracking-wide px-6 py-2.5 md:px-8 md:py-3 hover:bg-gray-100 transition-colors duration-200">
                      {collection.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCollections;