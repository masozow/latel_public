// Script para analizar la estructura de la base de datos desde el CSV
async function analyzeDatabaseStructure() {
  try {
    console.log("Analizando estructura de la base de datos...")

    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/diccionario_completo_bd_latel.xlsx%20-%20Diccionario%20BD-J8APRJF0I8DR6Att5pcztL3wOvf1Uc.csv",
    )
    const csvText = await response.text()

    console.log("Contenido del CSV:")
    console.log(csvText)

    // Parsear el CSV
    const lines = csvText.split("\n")
    const tables: Record<string, any> = {}
    let currentTable = ""
    let currentObjective = ""
    let isReadingColumns = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const columns = line.split(",").map((col) => col.replace(/"/g, "").trim())

      // Detectar nueva tabla
      if (columns[0] && columns[1] && !isReadingColumns) {
        // Si la primera columna no es "Nombre de la columna", es una nueva tabla
        if (columns[0] !== "Nombre de la columna" && columns[0] !== "Tabla") {
          currentTable = columns[0]
          currentObjective = columns[1] || ""
          tables[currentTable] = {
            objective: currentObjective,
            columns: [],
          }
          isReadingColumns = false
        }
      }

      // Detectar encabezados de columnas
      if (columns[0] === "Nombre de la columna") {
        isReadingColumns = true
        continue
      }

      // Leer columnas
      if (isReadingColumns && currentTable && columns[0] && columns[1]) {
        tables[currentTable].columns.push({
          name: columns[0],
          type: columns[1],
          explanation: columns[2] || "",
          isForeignKey: (columns[2] || "").toLowerCase().includes("viene de la tabla"),
        })
      }

      // Detectar fin de tabla (línea vacía o nueva tabla)
      if (!columns[0] && !columns[1] && !columns[2]) {
        isReadingColumns = false
      }
    }

    console.log("Tablas encontradas:")
    console.log(JSON.stringify(tables, null, 2))

    return tables
  } catch (error) {
    console.error("Error analizando la base de datos:", error)
  }
}

// Ejecutar el análisis
analyzeDatabaseStructure()
