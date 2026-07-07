import { generateObject } from "ai"
import { z } from "zod"

export const maxDuration = 30

const scheduleSchema = z.object({
  tasks: z
    .array(
      z.object({
        start: z.string().describe("Start time in 24-hour HH:MM format, e.g. 05:00"),
        end: z.string().describe("End time in 24-hour HH:MM format, e.g. 06:30"),
        title: z.string().describe("Short, punchy task title (max 5 words)"),
        note: z
          .string()
          .describe("One concise sentence describing what to do in this block"),
      }),
    )
    .describe("Chronologically ordered list of the day's time blocks"),
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return Response.json(
        { error: "Tolong isi kegiatanmu dulu ya." },
        { status: 400 },
      )
    }

    const { object } = await generateObject({
      model: "google/gemini-3.5-flash",
      schema: scheduleSchema,
      system: [
        "Kamu adalah asisten penyusun jadwal harian untuk seorang pelajar SMP kelas 7 yang juga atlet sepeda fixed-gear, peserta OSN Matematika, dan menjalankan bisnis gula aren (Kopsus Gula Aren).",
        "Tugasmu: dari catatan kegiatan bebas yang ditulis user (termasuk kejadian tak terduga), susun jadwal harian yang realistis, seimbang, dan berurutan secara kronologis.",
        "Aturan: gunakan format waktu 24 jam HH:MM. Jangan ada blok waktu yang tumpang tindih. Sisipkan waktu istirahat/transisi bila perlu. Sesuaikan prioritas berdasarkan hal tak terduga yang disebut user.",
        "Judul singkat dan bertenaga. Catatan cukup satu kalimat. Balas dalam bahasa Indonesia.",
      ].join(" "),
      prompt,
    })

    return Response.json(object)
  } catch (err) {
    console.error("[v0] generate-schedule error:", err)
    return Response.json(
      {
        error: "Gagal membuat jadwal. Coba lagi sebentar ya.",
        debug: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    )
  }
}
