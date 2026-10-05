import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'
import path from 'path'
import fs from 'fs/promises'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Verify admin session (with development fallback)
  const session = await getAdminSession()
  if (!session && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized staff access' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]
    const singleFile = formData.get('file') as File | null

    const uploadList: File[] = []
    if (files && files.length > 0) {
      for (const f of files) {
        if (f && typeof f !== 'string' && f.size > 0) {
          uploadList.push(f)
        }
      }
    } else if (singleFile && typeof singleFile !== 'string' && singleFile.size > 0) {
      uploadList.push(singleFile)
    }

    if (uploadList.length === 0) {
      return NextResponse.json({ error: 'Tiada fail imej dikesan untuk dimuat naik' }, { status: 400 })
    }

    const targetDir = path.join(process.cwd(), 'public', 'images', 'products')
    await fs.mkdir(targetDir, { recursive: true })

    const savedFiles: { url: string; fileName: string; originalName: string; size: number }[] = []

    for (const file of uploadList) {
      // Validate file type
      const mime = file.type || ''
      const isImage = mime.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(file.name)
      if (!isImage) {
        continue
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Safe clean filename
      const rawExt = path.extname(file.name).toLowerCase()
      const ext = rawExt || '.jpg'
      const baseClean = path
        .basename(file.name, rawExt)
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 40)
        .toLowerCase()

      const randSuffix = Math.random().toString(36).substring(2, 7)
      const safeFileName = `upload-${Date.now()}-${randSuffix}-${baseClean || 'product'}${ext}`

      const filePath = path.join(targetDir, safeFileName)
      await fs.writeFile(filePath, buffer)

      savedFiles.push({
        url: `/images/products/${safeFileName}`,
        fileName: safeFileName,
        originalName: file.name,
        size: file.size,
      })
    }

    if (savedFiles.length === 0) {
      return NextResponse.json(
        { error: 'Hanya fail format imej dibenarkan (JPG, PNG, WEBP, GIF, dsb.)' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Berjaya memuat naik ${savedFiles.length} fail imej`,
      files: savedFiles,
      url: savedFiles[0].url,
    })
  } catch (error: any) {
    console.error('[API /api/admin/upload] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Ralat semasa memproses fail muat naik' },
      { status: 500 }
    )
  }
}
