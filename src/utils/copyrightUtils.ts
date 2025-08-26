/**
 * Copyright Utilities for B.E.E App Bahamas
 * © 2024 B.E.E App Bahamas - All Rights Reserved
 * 
 * This file contains utility functions for copyright protection and enforcement.
 * Unauthorized use, modification, or distribution is strictly prohibited.
 */

export const COPYRIGHT_NOTICE = `© ${new Date().getFullYear()} B.E.E App Bahamas. All rights reserved.`;

export const FULL_COPYRIGHT_NOTICE = `
Copyright © ${new Date().getFullYear()} B.E.E App Bahamas

All rights reserved. No part of this application, including but not limited to the source code, 
user interface, graphics, logos, text, and other content, may be reproduced, distributed, 
transmitted, cached, or otherwise used, except with the prior written permission of B.E.E App Bahamas.

This application and its contents are protected by copyright law and international treaties. 
Unauthorized reproduction or distribution of this application, or any portion of it, may result 
in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible 
under the law.

For licensing inquiries, please contact: legal@beeapp.bs
`;

export const TRADEMARK_NOTICE = "B.E.E App™ is a trademark of B.E.E App Bahamas.";

/**
 * Adds copyright metadata to user-generated content
 */
export const addCopyrightMetadata = (content: any) => {
  return {
    ...content,
    _copyright: COPYRIGHT_NOTICE,
    _timestamp: new Date().toISOString(),
    _protected: true
  };
};

/**
 * Validates content ownership and copyright compliance
 */
export const validateContentOwnership = (content: any, userId: string) => {
  // Implementation would check against database for content ownership
  return {
    isOwner: true, // Placeholder
    canModify: true, // Placeholder
    copyrightStatus: 'valid'
  };
};

/**
 * Generates DMCA takedown notice template
 */
export const generateDMCANotice = (infringingContent: string, originalContent: string) => {
  return `
DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) TAKEDOWN NOTICE

To: B.E.E App Bahamas Copyright Agent
Date: ${new Date().toLocaleDateString()}

I, the undersigned, state UNDER PENALTY OF PERJURY that:

1. I am the owner, or authorized to act on behalf of the owner, of certain intellectual property rights;

2. I have a good faith belief that the use of the material described below is not authorized by the copyright owner, its agent, or the law;

3. The information in this notification is accurate;

4. The following material is claimed to be infringing:
   Original Content: ${originalContent}
   Infringing Content: ${infringingContent}

5. I request that you remove or disable access to this material.

This notice serves as an official request under the DMCA.

Contact Information:
B.E.E App Bahamas Legal Department
Nassau, The Bahamas
legal@beeapp.bs
  `;
};

/**
 * Security headers for copyright protection
 */
export const getCopyrightHeaders = () => {
  return {
    'X-Content-Copyright': COPYRIGHT_NOTICE,
    'X-App-Protected': 'true',
    'X-Rights-Management': 'strict',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
  };
};

/**
 * Watermark generation utility
 */
export const generateWatermark = (text: string = COPYRIGHT_NOTICE) => {
  return {
    text,
    opacity: 0.1,
    position: 'bottom-right',
    fontSize: '12px',
    color: '#666666'
  };
};