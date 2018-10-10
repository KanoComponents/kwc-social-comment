import '../kwc-social-comments.js';

suite('kwc-social-comments', () => {
    test('instantiating the element works', () => {
        const element = document.createElement('kwc-social-comments');
        assert.equal(element.is, 'kwc-social-comments');
    });
});
