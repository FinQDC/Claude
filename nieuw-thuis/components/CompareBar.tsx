const avatars = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=80',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=200&q=80',
]

export function CompareBar() {
  return (
    <div className="bg-night text-cream rounded-xl p-6 px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-15" style={{ marginBottom: '60px' }}>
      <div className="flex items-center gap-5">
        <div className="flex">
          {avatars.map((src, i) => (
            <div
              key={i}
              className="w-[50px] h-[50px] rounded-full border-[3px] border-night bg-cover bg-center"
              style={{
                backgroundImage: `url('${src}')`,
                marginLeft: i === 0 ? 0 : '-12px',
              }}
            />
          ))}
        </div>
        <div>
          <div className="font-serif font-medium text-[19px] tracking-tight">
            U heeft 3 locaties op uw shortlist
          </div>
          <div className="text-[13px] text-cream/70 mt-0.5">
            De Wilgenhof, Huize Anna, Zorgvilla Stein — vergelijk ze naast elkaar
          </div>
        </div>
      </div>
      <a
        href="#"
        className="bg-terracotta text-cream py-3 px-6 rounded-md no-underline font-semibold text-sm transition-colors hover:bg-terracotta-deep"
      >
        Vergelijk side-by-side →
      </a>
    </div>
  )
}
