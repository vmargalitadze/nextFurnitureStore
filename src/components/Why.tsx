import React from 'react'

const Why = () => {
  const whyItems = [
    {
      id: 1,
      title: "ხარისხი",
      titleEn: "Quality",
      description: "ჩვენ ვთავაზობთ მხოლოდ უმაღლესი ხარისხის ავეჯს",
      descriptionEn: "We offer only the highest quality furniture"
    },
    {
      id: 2,
      title: "სწრაფი მიწოდება",
      titleEn: "Fast Delivery",
      description: "სწრაფი და უსაფრთხო მიწოდება მთელი საქართველოში",
      descriptionEn: "Fast and secure delivery throughout Georgia"
    },
    {
      id: 3,
      title: "საუკეთესო ფასები",
      titleEn: "Best Prices",
      description: "კონკურენტუნარიანი ფასები ხარისხის გარეშე",
      descriptionEn: "Competitive prices without compromising quality"
    },
    {
      id: 4,
      title: "24/7 მხარდაჭერა",
      titleEn: "24/7 Support",
      description: "ჩვენი გუნდი ყოველთვის მზადაა დაგეხმაროთ",
      descriptionEn: "Our team is always ready to help you"
    },
    {
      id: 5,
      title: "გარანტია",
      titleEn: "Warranty",
      description: "სრული გარანტია ყველა ჩვენს პროდუქტზე",
      descriptionEn: "Full warranty on all our products"
    }
  ];

  return (
    <>
      <div className="container mx-auto">
        <div className="max-w-7xl  mx-auto">
          <div className="text-center py-12">
            <h2 className="text-[20px] text-white md:text-[30px] font-bold">რატომ ჩვენ?</h2>
          </div>
          
          {/* 5-Item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4">
            {whyItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-center">
                  {/* Icon Placeholder */}
                  <div className="w-16 h-16 bg-[#f3983e] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{item.id}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-[18px] md:text-[20px] font-bold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Why