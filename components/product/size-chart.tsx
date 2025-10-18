"use client"

export default function SizeChart() {
  return (
    <div className="mt-4 p-4 bg-muted rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2 font-semibold">Size</th>
            <th className="text-left py-2 px-2 font-semibold">Chest</th>
            <th className="text-left py-2 px-2 font-semibold">Length</th>
            <th className="text-left py-2 px-2 font-semibold">Sleeve</th>
          </tr>
        </thead>
        <tbody>
          {[
            { size: "XS", chest: '32-34"', length: '26"', sleeve: '7"' },
            { size: "S", chest: '34-36"', length: '27"', sleeve: '7.5"' },
            { size: "M", chest: '36-38"', length: '28"', sleeve: '8"' },
            { size: "L", chest: '38-40"', length: '29"', sleeve: '8.5"' },
            { size: "XL", chest: '40-42"', length: '30"', sleeve: '9"' },
            { size: "XXL", chest: '42-44"', length: '31"', sleeve: '9.5"' },
          ].map((row) => (
            <tr key={row.size} className="border-b border-border/50">
              <td className="py-2 px-2 font-medium">{row.size}</td>
              <td className="py-2 px-2">{row.chest}</td>
              <td className="py-2 px-2">{row.length}</td>
              <td className="py-2 px-2">{row.sleeve}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-3">
        💡 Tip: If you're between sizes, size up for a looser fit. Easy exchanges always available!
      </p>
    </div>
  )
}
