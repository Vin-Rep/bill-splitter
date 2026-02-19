interface Item {
    name: string
    price: number
    assignedTo: string[]
  }
  
  interface Props {
    items: Item[]
    subtotal: number
    tax: number
    total: number
    people: string[]
    onItemsChange: (items: Item[]) => void
  }
  
  function ItemTable({ items, subtotal, tax, total, people, onItemsChange }: Props) {
    const updateItem = (index: number, field: 'name' | 'price', value: string) => {
      const updated = [...items]
      if (field === 'price') {
        updated[index] = { ...updated[index], price: parseFloat(value) || 0 }
      } else {
        updated[index] = { ...updated[index], name: value }
      }
      onItemsChange(updated)
    }
  
    const toggleAssignment = (itemIndex: number, person: string) => {
      const updated = [...items]
      const item = updated[itemIndex]
      if (item.assignedTo.includes(person)) {
        item.assignedTo = item.assignedTo.filter(p => p !== person)
      } else {
        item.assignedTo = [...item.assignedTo, person]
      }
      onItemsChange(updated)
    }
  
    return (
      <div style={{ marginTop: 32 }}>
        <h2>Receipt Items</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ccc' }}>Item</th>
              <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #ccc' }}>Price</th>
              {people.map(person => (
                <th key={person} style={{ textAlign: 'center', padding: 8, borderBottom: '1px solid #ccc' }}>
                  {person || '?'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: 8 }}>
                  <input
                    value={item.name}
                    onChange={e => updateItem(index, 'name', e.target.value)}
                    style={{ width: '100%', border: '1px solid #ddd', padding: 4 }}
                  />
                </td>
                <td style={{ padding: 8 }}>
                  <input
                    type="number"
                    value={item.price}
                    onChange={e => updateItem(index, 'price', e.target.value)}
                    style={{ width: 80, border: '1px solid #ddd', padding: 4, textAlign: 'right' }}
                  />
                </td>
                {people.map(person => (
                  <td key={person} style={{ textAlign: 'center', padding: 8 }}>
                    <input
                      type="checkbox"
                      checked={item.assignedTo.includes(person)}
                      onChange={() => toggleAssignment(index, person)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ padding: 8, fontWeight: 'bold' }}>Subtotal</td>
              <td style={{ padding: 8, textAlign: 'right' }}>${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 'bold' }}>Tax</td>
              <td style={{ padding: 8, textAlign: 'right' }}>${tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ padding: 8, fontWeight: 'bold' }}>Total</td>
              <td style={{ padding: 8, textAlign: 'right' }}>${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }
  
  export default ItemTable