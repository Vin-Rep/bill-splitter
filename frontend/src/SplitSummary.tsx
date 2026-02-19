interface Item {
    name: string
    price: number
    assignedTo: string[]
  }
  
  interface PersonSummary {
    name: string
    items: { name: string; share: number }[]
    subtotal: number
    taxShare: number
    total: number
  }
  
  interface Props {
    items: Item[]
    tax: number
    total: number
    people: string[]
  }
  
  function SplitSummary({ items, tax, total, people }: Props) {
    const calculateSplits = (): PersonSummary[] => {
      const overallSubtotal = items.reduce((sum, item) => sum + item.price, 0)
  
      return people
        .filter(p => p.trim() !== '')
        .map(person => {
          const personItems = items
            .filter(item => item.assignedTo.includes(person))
            .map(item => ({
              name: item.name,
              share: item.price / item.assignedTo.length
            }))
  
          const personSubtotal = personItems.reduce((sum, i) => sum + i.share, 0)
          const taxShare = overallSubtotal > 0
            ? (personSubtotal / overallSubtotal) * tax
            : 0
  
          return {
            name: person,
            items: personItems,
            subtotal: personSubtotal,
            taxShare,
            total: personSubtotal + taxShare
          }
        })
    }
  
    const splits = calculateSplits()
  
    if (people.filter(p => p.trim()).length === 0) return null
  
    return (
      <div style={{ marginTop: 32 }}>
        <h2>Split Summary</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {splits.map(person => (
            <div key={person.name} style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              minWidth: 200,
              flex: 1
            }}>
              <h3 style={{ margin: '0 0 12px 0' }}>{person.name}</h3>
              {person.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 14 }}>
                  <span>{item.name}</span>
                  <span>${item.share.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #eee', marginTop: 8, paddingTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>Tax</span>
                  <span>${person.taxShare.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: 4 }}>
                  <span>Total</span>
                  <span>${person.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default SplitSummary