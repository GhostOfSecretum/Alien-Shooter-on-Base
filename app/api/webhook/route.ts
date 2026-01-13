import { NextRequest, NextResponse } from 'next/server';

// Webhook endpoint для обработки событий от Base app
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Обработка различных типов событий
    console.log('Webhook received:', body);
    
    // Здесь можно обрабатывать:
    // - Уведомления
    // - События от пользователей
    // - Другие интеграции
    
    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed successfully' 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint для проверки работоспособности
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Webhook endpoint is active' 
  });
}

