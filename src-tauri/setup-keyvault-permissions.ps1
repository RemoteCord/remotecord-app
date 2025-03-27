<#
.SYNOPSIS
    Sets up Azure Key Vault permissions for an application.
    
.DESCRIPTION
    This PowerShell script configures Azure Key Vault permissions including RBAC roles
    and access policies for a specified application. It handles both modern RBAC-based
    permissions and traditional Access Policy permissions to ensure comprehensive access.
    
.NOTES
    Version:        1.0
    Author:         Your Name
    Creation Date:  2023-11-11
#>

#############################################
# Configuration Variables - Modify as needed
#############################################

# Key Vault Information
$keyVaultName = "keys-remotecord"                                  # Name of the Key Vault
$keyVaultResourceGroup = "remotecord"                   # Resource group containing the Key Vault

# Application Information
$applicationId = "14a01df9-26d6-4299-a07f-a2115af3e80a"            # Application (Client) ID
$applicationObjectId = "3d258dc7-8669-4473-ae52-aaf1a1ef77af"      # Object ID of the application in Azure AD
$tenantId = "d000bb5c-fc5c-49a8-a5a4-762fe6a16a5e"                # Tenant ID

# Certificate Information
$certificateName = "certificate-remotecord"                        # Name of the certificate in Key Vault

# Permission Settings
$enableRBAC = $true                                               # Set to $true to configure RBAC roles (newer approach)
$enableAccessPolicies = $true                                     # Set to $true to configure Access Policies (traditional approach)

#############################################
# Script Initialization
#############################################

# Error handling preference
$ErrorActionPreference = "Stop"

Write-Host "========== Azure Key Vault Permission Setup ==========" -ForegroundColor Cyan

# Check for Azure PowerShell module
if (!(Get-Module -ListAvailable -Name Az)) {
    Write-Host "Azure PowerShell module not found. Installing..." -ForegroundColor Yellow
    Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
}

try {
    # Connect to Azure if not already connected
    $azContext = Get-AzContext
    if (!$azContext) {
        Write-Host "Connecting to Azure..." -ForegroundColor Yellow
        Connect-AzAccount -TenantId $tenantId
    }
    else {
        Write-Host "Already connected to Azure as $($azContext.Account)" -ForegroundColor Green
        
        # Check if connected to the correct tenant
        if ($azContext.Tenant.Id -ne $tenantId) {
            Write-Host "Switching to the correct tenant..." -ForegroundColor Yellow
            Connect-AzAccount -TenantId $tenantId
        }
    }

    # Get the Key Vault
    Write-Host "Retrieving Key Vault information..." -ForegroundColor Yellow
    $keyVault = Get-AzKeyVault -VaultName $keyVaultName -ResourceGroupName $keyVaultResourceGroup
    if (!$keyVault) {
        throw "Key Vault '$keyVaultName' not found in resource group '$keyVaultResourceGroup'"
    }
    
    Write-Host "Key Vault found: $($keyVault.VaultName)" -ForegroundColor Green

    #############################################
    # Configure RBAC Roles (Modern Approach)
    #############################################
    
    if ($enableRBAC) {
        Write-Host "Configuring RBAC roles for the application..." -ForegroundColor Yellow
        
        # Define RBAC roles to assign
        $rolesToAssign = @(
            "Key Vault Certificates Officer",
            "Key Vault Secrets User"
        )
        
        foreach ($roleName in $rolesToAssign) {
            # Check if role assignment already exists
            $existingAssignment = Get-AzRoleAssignment -ObjectId $applicationObjectId -RoleDefinitionName $roleName -Scope $keyVault.ResourceId
            
            if (!$existingAssignment) {
                Write-Host "Assigning role '$roleName' to application..." -ForegroundColor Yellow
                New-AzRoleAssignment -ObjectId $applicationObjectId -RoleDefinitionName $roleName -Scope $keyVault.ResourceId
                Write-Host "Role '$roleName' assigned successfully" -ForegroundColor Green
            }
            else {
                Write-Host "Role '$roleName' is already assigned" -ForegroundColor Green
            }
        }
    }
    
    #############################################
    # Configure Access Policies (Traditional Approach)
    #############################################
    
    if ($enableAccessPolicies) {
        Write-Host "Configuring Key Vault Access Policies for the application..." -ForegroundColor Yellow
        
        # Define Access Policy permissions
        $certificatePermissions = @("Get", "List", "Update", "Create", "Import", "Delete", "Recover", "Backup", "Restore")
        $secretPermissions = @("Get", "List", "Set", "Delete", "Recover", "Backup", "Restore")
        $keyPermissions = @("Get", "List", "Update", "Create", "Import", "Delete", "Recover", "Backup", "Restore", "Sign", "Verify")
        
        # Check if access policy already exists
        $existingPolicy = $keyVault.AccessPolicies | Where-Object { $_.ApplicationId -eq $applicationId -or $_.ObjectId -eq $applicationObjectId }
        
        if ($existingPolicy) {
            Write-Host "Updating existing access policy for application..." -ForegroundColor Yellow
            
            Set-AzKeyVaultAccessPolicy -VaultName $keyVaultName -ObjectId $applicationObjectId `
                -PermissionsToCertificates $certificatePermissions `
                -PermissionsToSecrets $secretPermissions `
                -PermissionsToKeys $keyPermissions
        }
        else {
            Write-Host "Creating new access policy for application..." -ForegroundColor Yellow
            
            Set-AzKeyVaultAccessPolicy -VaultName $keyVaultName -ObjectId $applicationObjectId `
                -PermissionsToCertificates $certificatePermissions `
                -PermissionsToSecrets $secretPermissions `
                -PermissionsToKeys $keyPermissions
        }
        
        Write-Host "Access policies configured successfully" -ForegroundColor Green
    }
    
    #############################################
    # Verify Access
    #############################################
    
    Write-Host "Verifying application access to Key Vault certificate..." -ForegroundColor Yellow
    
    try {
        $certificate = Get-AzKeyVaultCertificate -VaultName $keyVaultName -Name $certificateName
        if ($certificate) {
            Write-Host "Certificate access verified! Application should now have proper access to the certificate." -ForegroundColor Green
        }
        else {
            Write-Host "Certificate '$certificateName' not found in Key Vault." -ForegroundColor Red
        }
    }
    catch {
        Write-Host "Warning: Could not verify certificate access. You may need to run this script with an account that has access to the certificate." -ForegroundColor Yellow
        Write-Host "Error details: $_" -ForegroundColor Red
    }
    
    Write-Host "`nSetup complete! If you still encounter permission issues, consider the following:" -ForegroundColor Cyan
    Write-Host "1. Ensure the application has been granted admin consent in Azure AD" -ForegroundColor White
    Write-Host "2. For OBO (On-Behalf-Of) flow requirements, you may need additional Azure AD app registration settings" -ForegroundColor White
    Write-Host "3. Wait a few minutes for permission changes to propagate through Azure" -ForegroundColor White
}
catch {
    Write-Host "Error occurred during setup:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor DarkRed
}

