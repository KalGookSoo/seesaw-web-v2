import assert from 'node:assert/strict';
import test from 'node:test';
import { contentPermissions } from '../lib/content-permissions.ts';

const user = { userId: '1', username: 'member', authorities: ['ROLE_USER'] };
const manager = { userId: '2', username: 'manager', authorities: ['ROLE_MANAGER'] };

test('비로그인과 일반 사용자는 다른 사용자의 게시글을 관리하지 못한다', () => {
  for (const permission of [contentPermissions(null, false, 'author'), contentPermissions(user, true, 'author')]) {
    assert.equal(permission.canMove, false);
    assert.equal(permission.canEdit, false);
    assert.equal(permission.canDelete, false);
  }
  assert.equal(contentPermissions(user, true, null).owner, false);
});

test('작성자는 수정과 삭제만, 관리자는 게시글과 일정에 맞는 권한을 갖는다', () => {
  assert.deepEqual(contentPermissions(user, true, 'member'), { owner: true, manager: false, canMove: false, canEdit: true, canDelete: true });
  assert.deepEqual(contentPermissions(manager, true, 'other'), { owner: false, manager: true, canMove: true, canEdit: false, canDelete: true });
  assert.equal(contentPermissions(manager, true, 'other', true).canEdit, true);
});
