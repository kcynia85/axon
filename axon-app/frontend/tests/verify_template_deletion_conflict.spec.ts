import { test, expect } from '@playwright/test';

test.describe('Template Deletion Conflict', () => {
  test('should prevent deletion of template used in a pattern', async ({ request }) => {
    // 1. Create a Template
    const templateRes = await request.post('http://localhost:8000/api/v1/workspaces/ws-discovery/templates', {
      data: {
        template_name: 'Conflict Test Template',
        template_description: 'To be used in pattern',
        template_markdown_content: '# Test',
        availability_workspace: ['ws-discovery']
      }
    });
    expect(templateRes.ok()).toBeTruthy();
    const template = await templateRes.json();
    const templateId = template.id;

    // 2. Create a Pattern that uses this Template
    // We simulate the graph structure containing the template ID
    const patternRes = await request.post('http://localhost:8000/api/v1/workspaces/ws-discovery/patterns', {
      data: {
        pattern_name: 'Conflict Test Pattern',
        pattern_graph_structure: {
            nodes: [
                { id: 'node-1', type: 'template', data: { templateId: templateId } }
            ],
            edges: []
        },
        availability_workspace: ['ws-discovery']
      }
    });
    expect(patternRes.ok()).toBeTruthy();
    const pattern = await patternRes.json();
    const patternId = pattern.id;

    // 3. Attempt to Delete the Template
    const deleteRes = await request.delete(`http://localhost:8000/api/v1/workspaces/ws-discovery/templates/${templateId}`);
    
    // 4. Verify 409 Conflict
    expect(deleteRes.status()).toBe(409);
    const errorBody = await deleteRes.json();
    expect(errorBody.detail).toContain('Cannot delete template');
    expect(errorBody.detail).toContain('Conflict Test Pattern');

    // Clean up: Delete Pattern first, then Template
    await request.delete(`http://localhost:8000/api/v1/workspaces/ws-discovery/patterns/${patternId}`);
    const deleteRes2 = await request.delete(`http://localhost:8000/api/v1/workspaces/ws-discovery/templates/${templateId}`);
    expect(deleteRes2.status()).toBe(204);
  });
});
