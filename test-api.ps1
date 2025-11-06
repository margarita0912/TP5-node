# Script para probar la API de Node.js + SQLite
Write-Host "🧪 Iniciando pruebas del API..." -ForegroundColor Green

# 1. Probar health check
Write-Host "`n1️⃣ Probando Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/healthz" -Method GET
    Write-Host "✅ Health Check OK:" -ForegroundColor Green
    $health | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Error en Health Check: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Probar ruta principal
Write-Host "`n2️⃣ Probando ruta principal..." -ForegroundColor Yellow
try {
    $root = Invoke-RestMethod -Uri "http://localhost:8080" -Method GET
    Write-Host "✅ Ruta principal OK:" -ForegroundColor Green
    $root | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Error en ruta principal: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Obtener usuarios (inicialmente vacío)
Write-Host "`n3️⃣ Obteniendo usuarios..." -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "http://localhost:8080/users" -Method GET
    Write-Host "✅ Usuarios obtenidos:" -ForegroundColor Green
    if ($users.Count -eq 0) {
        Write-Host "📭 No hay usuarios aún" -ForegroundColor Cyan
    } else {
        $users | ConvertTo-Json -Depth 3
    }
} catch {
    Write-Host "❌ Error obteniendo usuarios: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Crear usuario de prueba
Write-Host "`n4️⃣ Creando usuario de prueba..." -ForegroundColor Yellow
try {
    $newUser = @{
        username = "testuser"
        password = "test123"
    }
    $body = $newUser | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "http://localhost:8080/users" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Usuario creado:" -ForegroundColor Green
    $result | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Error creando usuario: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Obtener usuarios nuevamente
Write-Host "`n5️⃣ Obteniendo usuarios después de crear uno..." -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "http://localhost:8080/users" -Method GET
    Write-Host "✅ Usuarios obtenidos:" -ForegroundColor Green
    $users | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Error obteniendo usuarios: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Obtener usuario por ID
if ($result -and $result.id) {
    Write-Host "`n6️⃣ Obteniendo usuario por ID ($($result.id))..." -ForegroundColor Yellow
    try {
        $user = Invoke-RestMethod -Uri "http://localhost:8080/users/$($result.id)" -Method GET
        Write-Host "✅ Usuario obtenido por ID:" -ForegroundColor Green
        $user | ConvertTo-Json -Depth 3
    } catch {
        Write-Host "❌ Error obteniendo usuario por ID: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 7. Probar validaciones - username muy corto
Write-Host "`n7️⃣ Probando validación (username muy corto)..." -ForegroundColor Yellow
try {
    $invalidUser = @{
        username = "ab"
        password = "test123"
    }
    $body = $invalidUser | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "http://localhost:8080/users" -Method POST -Body $body -ContentType "application/json"
    Write-Host "❌ ERROR: Debería haber fallado la validación" -ForegroundColor Red
} catch {
    Write-Host "✅ Validación funcionando correctamente: $($_.Exception.Message)" -ForegroundColor Green
}

# 8. Probar usuario duplicado
Write-Host "`n8️⃣ Probando usuario duplicado..." -ForegroundColor Yellow
try {
    $duplicateUser = @{
        username = "testuser"
        password = "test123"
    }
    $body = $duplicateUser | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "http://localhost:8080/users" -Method POST -Body $body -ContentType "application/json"
    Write-Host "❌ ERROR: Debería haber fallado por usuario duplicado" -ForegroundColor Red
} catch {
    Write-Host "✅ Prevención de usuarios duplicados funcionando: $($_.Exception.Message)" -ForegroundColor Green
}

# 9. Probar endpoint inexistente
Write-Host "`n9️⃣ Probando endpoint inexistente..." -ForegroundColor Yellow
try {
    $notFound = Invoke-RestMethod -Uri "http://localhost:8080/inexistente" -Method GET
    Write-Host "❌ ERROR: Debería haber devuelto 404" -ForegroundColor Red
} catch {
    Write-Host "✅ Manejo de 404 funcionando correctamente" -ForegroundColor Green
}

Write-Host "`n🎉 ¡Pruebas completadas!" -ForegroundColor Green
Write-Host "💡 Para detener el servidor, presiona Ctrl+C en la terminal donde está ejecutándose" -ForegroundColor Cyan