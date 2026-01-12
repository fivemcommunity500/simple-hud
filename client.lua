local ESX = exports["es_extended"]:getSharedObject()
local isEditMode = false

-- Comando para mover el HUD
RegisterCommand('hud-edit', function()
    isEditMode = not isEditMode
    SetNuiFocus(isEditMode, isEditMode)
    SendNUIMessage({
        action = "toggleEdit",
        active = isEditMode
    })
end)

-- Comando para refrescar con mensaje neón
RegisterCommand('refreshhud', function()
    SendNUIMessage({ action = "notifyRefresh" })
end)

-- Tecla rápida para editar (Opcional: F6)
RegisterKeyMapping('hud-edit', 'Editar posición del HUD', 'keyboard', 'F6')

-- Callback para cerrar el modo edición desde JS (ESC/ENTER)
RegisterNUICallback('exitEditMode', function(data, cb)
    isEditMode = false
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = "toggleEdit",
        active = false
    })
    cb('ok')
end)

-- Hilo principal de actualización
Citizen.CreateThread(function()
    while ESX == nil do Wait(100) end
    while true do
        Citizen.Wait(2000)
        if ESX.IsPlayerLoaded() then
            local pData = ESX.GetPlayerData()
            if pData and pData.accounts then
                local cash, bank, black = 0, 0, 0
                for i=1, #pData.accounts do
                    local account = pData.accounts[i]
                    if account.name == 'money' then cash = account.money
                    elseif account.name == 'bank' then bank = account.money
                    elseif account.name == 'black_money' then black = account.money end
                end

                SendNUIMessage({
                    action = "updateHUD",
                    cash = cash,
                    bank = bank,
                    black = black,
                    job = pData.job.label,
                    grade = pData.job.grade_label,
                    playerId = GetPlayerServerId(PlayerId())
                })
            end
        end
    end
end)